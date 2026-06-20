from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from database import supabase
from email_service import send_email
import traceback
import psycopg2
import os
from pathlib import Path
from dotenv import load_dotenv
import random
import time

root_env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=root_env_path)
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

# In-memory store for OTPs (For production, use Redis or a DB table)
pending_registrations = {}

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Health Care API"}

@app.post("/api/auth/send-otp")
def send_registration_otp(req: RegisterRequest):
    try:
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
            
        # 2. Insert into public.users using psycopg2 to bypass RLS
        full_name = f"{user_req.firstName} {user_req.lastName}"
        
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        cur.execute(
            """
            INSERT INTO public.users (user_id, full_name, email, role, phone)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (user_id, full_name, user_req.email, user_req.role, user_req.phone)
        )
        
        # 3. If doctor, insert into doctor_profiles
        if user_req.role == "doctor":
            cur.execute(
                """
                INSERT INTO public.doctor_profiles (user_id, specialty, license_number)
                VALUES (%s, %s, %s)
                """,
                (user_id, user_req.specialization, user_req.licenseNumber)
            )
            
        conn.commit()
        cur.close()
        conn.close()
            
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
        
        return {"message": "User registered successfully", "user_id": user_id}
        
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
def health_check():
    try:
        response = supabase.table("users").select("*").limit(1).execute()
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
