from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from database import supabase, supabase_admin
from email_service import send_email
import traceback
import psycopg2
import os
from pathlib import Path
from dotenv import load_dotenv
import random
import time
import json
import base64
import io
from groq import Groq
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

root_env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=root_env_path, override=True)
DATABASE_URL = os.environ.get("DATABASE_URL")

app = FastAPI(title="Smart Health Care API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, modify in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class RegisterRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    role: str
    phone: str = ""
    dob: str = ""
    # Doctor specific
    licenseNumber: str = ""
    specialization: str = ""

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# In-memory store for OTPs (For production, use Redis or a DB table)
pending_registrations = {}
pending_password_resets = {}

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Health Care API"}

@app.post("/api/auth/send-otp")
def send_registration_otp(req: RegisterRequest):
    try:
        # Check if user already exists
        response = supabase_admin.table("users").select("user_id").eq("email", req.email).execute()
        if response.data:
            raise Exception("User already registered")


        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        
        # Store in memory
        pending_registrations[req.email] = {
            "otp": otp,
            "data": req,
            "timestamp": time.time()
        }
        
        # Send OTP email
        email_body = f"""
        Hello {req.firstName},
        
        Your verification code for Smart Health Care is: {otp}
        
        Please enter this code to complete your registration.
        """
        success = send_email(
            to_email=req.email,
            subject="Smart Health Care - Verification Code",
            body=email_body
        )
        
        if not success:
            raise Exception("Failed to send OTP email")
            
        return {"message": "OTP sent successfully"}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/verify-otp")
def verify_otp_and_register(req: OTPVerifyRequest):
    try:
        record = pending_registrations.get(req.email)
        if not record:
            raise Exception("No pending registration found for this email.")
            
        if record["otp"] != req.otp:
            raise Exception("Invalid OTP.")
            
        user_req = record["data"]
        
        # 1. Sign up user in Supabase Auth
        # MUST disable "Confirm email" in Supabase settings
        auth_response = supabase.auth.sign_up({
            "email": user_req.email,
            "password": user_req.password
        })
        
        user_id = None
        if auth_response.user:
            user_id = auth_response.user.id
        else:
            raise Exception("Failed to create user in Supabase Auth")
            
        # 2. Insert into public.users using supabase_admin to bypass RLS
        full_name = f"{user_req.firstName} {user_req.lastName}"
        
        user_data = {
            "user_id": user_id,
            "full_name": full_name,
            "email": user_req.email,
            "role": user_req.role,
            "phone": user_req.phone
        }
        supabase_admin.table("users").insert(user_data).execute()
        
        # 3. If doctor, insert into doctor_profiles
        if user_req.role == "doctor":
            doc_data = {
                "user_id": user_id,
                "specialty": user_req.specialization,
                "license_number": user_req.licenseNumber
            }
            supabase_admin.table("doctor_profiles").insert(doc_data).execute()
            
        # Clean up OTP
        del pending_registrations[req.email]

        
        # 4. Send Welcome Email
        email_body = f"""
        Hello {user_req.firstName},
        
        Welcome to Smart Health Care! Your account has been successfully created.
        Role: {user_req.role}
        
        Best regards,
        The Smart Health Care Team
        """
        send_email(
            to_email=user_req.email,
            subject="Welcome to Smart Health Care",
            body=email_body
        )
        
        user_data = {
            "user_id": user_id,
            "full_name": full_name,
            "email": user_req.email,
            "role": user_req.role,
            "phone": user_req.phone
        }
        
        return {"message": "User registered successfully", "user_id": user_id, "user": user_data}
        
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
def login(req: LoginRequest):
    try:
        # Sign in with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })
        
        if not auth_response.user:
            raise Exception("Invalid credentials")
            
        user_id = auth_response.user.id
        
        # Fetch user details from public.users
        response = supabase.table("users").select("*").eq("user_id", user_id).execute()
        if not response.data:
            raise Exception("User profile not found")
            
        user_data = response.data[0]
        
        return {
            "message": "Login successful", 
            "user": user_data, 
            "access_token": auth_response.session.access_token
        }
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    try:
        # Check if user exists
        response = supabase_admin.table("users").select("user_id, full_name").eq("email", req.email).execute()
        if not response.data:
            raise Exception("User not found")
        
        user_info = response.data[0]
        user_id = user_info["user_id"]
        full_name = user_info["full_name"]
        
        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        
        # Store in memory
        pending_password_resets[req.email] = {
            "otp": otp,
            "user_id": user_id,
            "timestamp": time.time()
        }
        
        # Send OTP email
        email_body = f"""
        Hello {full_name},
        
        Your password reset code for Smart Health Care is: {otp}
        
        Please enter this code to reset your password.
        """
        success = send_email(
            to_email=req.email,
            subject="Smart Health Care - Password Reset Code",
            body=email_body
        )
        
        if not success:
            raise Exception("Failed to send reset email")
            
        return {"message": "Reset code sent successfully"}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    try:
        record = pending_password_resets.get(req.email)
        if not record:
            raise Exception("No pending password reset found for this email.")
            
        if record["otp"] != req.otp:
            raise Exception("Invalid OTP.")
            
        user_id = record["user_id"]
        
        # Update password using Supabase admin
        supabase_admin.auth.admin.update_user_by_id(
            user_id,
            {"password": req.new_password}
        )
            
        # Clean up OTP
        del pending_password_resets[req.email]
        
        return {"message": "Password reset successfully"}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

# Pydantic models for symptom analysis and risk assessment
class SymptomAnalysisRequest(BaseModel):
    text: str

class RiskAssessmentRequest(BaseModel):
    symptoms: list[str]
    family_history: list[dict] = []
    image_findings: str = ""

# Groq Client Initialization
groq_key = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=groq_key) if groq_key else None

@app.post("/api/analyze-symptoms")
def analyze_symptoms(req: SymptomAnalysisRequest):
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API key not configured")
    try:
        prompt = f"""
        You are a clinical AI assistant specializing in breast health.
        Your task is to analyze the patient's description of their symptoms and extract a list of specific, distinct clinical symptoms.
        Additionally, determine if the described symptoms are related to or could indicate breast cancer or breast health issues.
        
        Patient description: "{req.text}"
        
        Return the output as a JSON object containing a list of strings called "extracted_symptoms" and a boolean "is_breast_cancer_related".
        Format example:
        {{
          "extracted_symptoms": ["Breast pain", "Lump detection", "Nipple discharge"],
          "is_breast_cancer_related": true
        }}
        
        Do not include any conversational text, markdown formatting (such as ```json) or explanations. Just return raw JSON.
        """
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a medical assistant that only responds in raw JSON format matching the requested schema."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0,
            response_format={"type": "json_object"}
        )
        response_content = chat_completion.choices[0].message.content
        data = json.loads(response_content)
        return data
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/generate-risk-assessment")
def generate_risk_assessment(req: RiskAssessmentRequest):
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API key not configured")
    try:
        prompt = f"""
        You are a clinical AI breast health risk assessment engine.
        Analyze the patient's profile below and calculate their breast health risk.
        
        Patient Data:
        - Symptoms reported: {req.symptoms}
        - Family History of relevant conditions: {req.family_history}
        - Imaging findings: {req.image_findings}
        
        Calculate:
        1. Generational Risk Score: a float value between 0.00 and 1.00 indicating likelihood of breast health risks.
        2. Risk Level: "Low", "Moderate", or "High" depending on score:
           - Low: score < 0.35
           - Moderate: 0.35 <= score < 0.70
           - High: score >= 0.70
        3. Contributing Factors: A list of specific clinical reasons based on the patient's data (e.g. family lineage conditions, symptoms, imaging results).
        4. Recommended Action: A short clinical recommendation summary of what the patient should do next (e.g., consult oncologist, schedule ultrasound/mammogram, etc.).
        
        Return the output strictly as a JSON object with this exact structure:
        {{
          "risk_level": "Low" | "Moderate" | "High",
          "generational_risk_score": 0.42,
          "contributing_factors": [
            "Factor 1",
            "Factor 2"
          ],
          "recommended_action": "Recommendation text..."
        }}
        
        Do not include any conversational text, explanations, or markdown formatting. Return raw JSON only.
        """
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a breast health risk assessment engine that only responds in raw JSON format matching the requested schema."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        response_content = chat_completion.choices[0].message.content
        data = json.loads(response_content)
        return data
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

# ─────────────────────────────────────────────
# OCR – Prescription & Lab Report Digitization
# ─────────────────────────────────────────────

class OCRResult(BaseModel):
    document_id: Optional[str] = None
    doc_type: str
    raw_text: str
    structured_data: dict
    quality_warning: Optional[str] = None

MIN_IMAGE_PIXELS = 200 * 200
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "bmp", "tiff", "tif" ,}

def _validate_file(filename: str, contents: bytes) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        return False
    if PIL_AVAILABLE:
        try:
            Image.open(io.BytesIO(contents)).verify()
        except Exception:
            return False
    return True

def _quality_check(contents: bytes) -> Optional[str]:
    if len(contents) < 2048:
        return "Image seems too small or blank. Please upload a readable image."
    if PIL_AVAILABLE:
        try:
            img = Image.open(io.BytesIO(contents))
            w, h = img.size
            if w * h < MIN_IMAGE_PIXELS:
                return "Image resolution too low. Please upload a clearer image."
        except Exception:
            return "Unable to process image. Please upload a valid image file."
    return None

def _ocr_with_groq(contents: bytes, doc_type: str) -> dict:
    b64 = base64.b64encode(contents).decode()
    if doc_type == "prescription":
        prompt = (
            "You are a medical OCR system. Extract all visible text from this prescription image. "
            "Return ONLY a raw JSON object (no markdown) with these exact keys: "
            "raw_text (string, full extracted text), "
            "summary (string, a brief easy-to-understand summary of the prescription), "
            "medications (list of objects with name, dosage, frequency, duration), "
            "doctor_name (string or null), date (string or null)."
        )
    else:
        prompt = (
            "You are a medical OCR system. Extract all visible text from this lab report image. "
            "Return ONLY a raw JSON object (no markdown) with these exact keys: "
            "raw_text (string, full extracted text), "
            "lab_name (string or null), "
            "tests (list of objects with test_name, value, unit, reference_range)."
        )

    completion = groq_client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}},
                ],
            }
        ],
        temperature=0.0,
        max_completion_tokens=1500,
    )
    raw = completion.choices[0].message.content.strip()
    # Strip markdown fences if model adds them
    if raw.startswith("```"):
        lines = raw.split("\n")
        raw = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
    return json.loads(raw)

@app.post("/ocr/upload", response_model=OCRResult)
async def upload_ocr(
    file: UploadFile = File(...),
    doc_type: str = Form("prescription"),
    patient_id: Optional[str] = Form(None),
):
    """OCR endpoint – accepts a prescription or lab report image and returns extracted text."""
    if doc_type not in ("prescription", "lab_report"):
        raise HTTPException(status_code=400, detail="doc_type must be 'prescription' or 'lab_report'")
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    contents = await file.read()

    # Step 1: validate file type / magic bytes
    if not _validate_file(file.filename or "", contents):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Please upload a valid image (PNG, JPG, BMP, TIFF).",
        )

    # Step 2: quality pre-check (TC19)
    quality_warning = _quality_check(contents)
    if quality_warning and "resolution" in quality_warning.lower():
        raise HTTPException(status_code=400, detail=quality_warning)

    # Step 3: Groq vision OCR
    try:
        result = _ocr_with_groq(contents, doc_type)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="OCR model returned unparseable output. Please try again.")
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

    # Step 4: reject if extracted text is too short (TC19 fallback)
    raw_text = result.get("raw_text", "").strip()
    if len(raw_text) < 10:
        raise HTTPException(
            status_code=400,
            detail="Image quality too low for accurate extraction. Please upload a clearer image.",
        )

    # Step 5: persist to EHR (Supabase ocr_documents table)
    document_id = None
    try:
        insert_data = {
            "patient_id": patient_id,
            "doc_type": doc_type,
            "raw_text": raw_text,
            "structured_data": result,
            "filename": file.filename,
        }
        db_response = supabase_admin.table("ocr_documents").insert(insert_data).execute()
        if db_response.data:
            document_id = str(db_response.data[0].get("id", ""))
    except Exception as e:
        # Storage failure is non-fatal – still return the extracted result
        print(f"[OCR] DB storage warning: {e}")

    return OCRResult(
        document_id=document_id,
        doc_type=doc_type,
        raw_text=raw_text,
        structured_data=result,
        quality_warning=quality_warning,
    )

@app.get("/ocr/documents")
async def list_ocr_documents(patient_id: Optional[str] = None):
    """Retrieve digitized documents for review (TC21)."""
    try:
        query = supabase_admin.table("ocr_documents").select("*").order("created_at", desc=True)
        if patient_id:
            query = query.eq("patient_id", patient_id)
        response = query.execute()
        return {"documents": response.data}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")

def health_check():
    try:
        response = supabase_admin.table("users").select("*").limit(1).execute()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {"status": "ok", "database": db_status}


@app.post("/test-email")
def test_email(to_email: str):
    try:
        success = send_email(
            to_email=to_email,
            subject="Smart Health Care Test",
            body="This is a test email from the Smart Health Care API."
        )
        if success:
            return {"message": "Email sent successfully"}
        else:
            return {"error": "Failed to send email"}, 500
    except Exception as e:
        return {"error": str(e)}, 500

@app.get("/api/auth/debug-otp")
def debug_otp():
    # Return pending registrations for testing
    # Convert RegisterRequest pydantic model to dict for JSON serialization
    res = {}
    for email, val in pending_registrations.items():
        res[email] = {
            "otp": val["otp"],
            "timestamp": val["timestamp"],
            "data": val["data"].dict() if hasattr(val["data"], "dict") else val["data"].model_dump()
        }
    return res

# Force reload

