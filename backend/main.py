from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from database import supabase
from email_service import send_email
import traceback

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

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Health Care API"}

@app.post("/api/auth/register")
def register_user(req: RegisterRequest):
    try:
        # 1. Sign up user in Supabase Auth
        # In a real app, users might need to confirm email.
        auth_response = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password
        })
        
        user_id = None
        if auth_response.user:
            user_id = auth_response.user.id
        else:
            raise Exception("Failed to create user in Auth")
            
        # 2. Insert into public.users
        full_name = f"{req.firstName} {req.lastName}"
        user_data = {
            "user_id": user_id,
            "full_name": full_name,
            "email": req.email,
            "role": req.role,
            "phone": req.phone
        }
        
        supabase.table("users").insert(user_data).execute()
        
        # 3. If doctor, insert into doctor_profiles
        if req.role == "doctor":
            doc_data = {
                "user_id": user_id,
                "specialty": req.specialization,
                "license_number": req.licenseNumber
            }
            supabase.table("doctor_profiles").insert(doc_data).execute()
            
        # 4. Send Welcome Email
        email_body = f"""
        Hello {req.firstName},
        
        Welcome to Smart Health Care! Your account has been successfully created.
        Role: {req.role}
        
        Best regards,
        The Smart Health Care Team
        """
        send_email(
            to_email=req.email,
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
