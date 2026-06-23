from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
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
from groq import Groq

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

# In-memory store for OTPs (For production, use Redis or a DB table)
pending_registrations = {}

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
        
        Patient description: "{req.text}"
        
        Return the output as a JSON object containing a list of strings called "extracted_symptoms".
        Format example:
        {{
          "extracted_symptoms": ["Breast pain", "Lump detection", "Nipple discharge"]
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

