from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import timedelta
import json
import base64

from database import get_db, init_db, User, Profile, CareerAnalysis
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from pdf_parser import parse_pdf_from_base64
from gemini_service import GeminiService

app = FastAPI(title="Career Compass API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    print("Database initialized successfully")

# Pydantic Models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str

class ProfileResponse(BaseModel):
    name: Optional[str]
    degree: Optional[str]
    qualifications: Optional[str]
    skills: Optional[str]
    gemini_api_key: Optional[str]
    profile_picture_base64: Optional[str]
    cv_pdf_base64: Optional[str]
    cv_text: Optional[str]

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    degree: Optional[str] = None
    qualifications: Optional[str] = None
    skills: Optional[str] = None
    gemini_api_key: Optional[str] = None
    profile_picture_base64: Optional[str] = None
    cv_pdf_base64: Optional[str] = None

class CareerSearchRequest(BaseModel):
    career_query: str

# Routes
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/auth/register", response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(request.password)
    new_user = User(email=request.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create empty profile for user
    new_profile = Profile(user_id=new_user.id)
    db.add(new_profile)
    db.commit()
    
    # Generate token
    access_token = create_access_token(
        data={"sub": new_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(access_token=access_token, email=new_user.email)

@app.post("/api/auth/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Generate token
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(access_token=access_token, email=user.email)

@app.get("/api/profile", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        # Create profile if it doesn't exist
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return ProfileResponse(
        name=profile.name,
        degree=profile.degree,
        qualifications=profile.qualifications,
        skills=profile.skills,
        gemini_api_key=profile.gemini_api_key,
        profile_picture_base64=profile.profile_picture_base64,
        cv_pdf_base64=profile.cv_pdf_base64,
        cv_text=profile.cv_text
    )

@app.put("/api/profile")
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    
    # Update fields if provided
    if request.name is not None:
        profile.name = request.name
    if request.degree is not None:
        profile.degree = request.degree
    if request.qualifications is not None:
        profile.qualifications = request.qualifications
    if request.skills is not None:
        profile.skills = request.skills
    if request.gemini_api_key is not None:
        profile.gemini_api_key = request.gemini_api_key
    if request.profile_picture_base64 is not None:
        profile.profile_picture_base64 = request.profile_picture_base64
    
    # Handle PDF upload and parsing
    if request.cv_pdf_base64 is not None:
        profile.cv_pdf_base64 = request.cv_pdf_base64
        # Parse PDF to extract text
        try:
            cv_text = parse_pdf_from_base64(request.cv_pdf_base64)
            profile.cv_text = cv_text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error parsing PDF: {str(e)}")
    
    db.commit()
    db.refresh(profile)
    
    return {"message": "Profile updated successfully"}

@app.post("/api/analyze-career")
async def analyze_career(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user profile
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Check if Gemini API key is set
    if not profile.gemini_api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API key not set. Please update your profile with a valid API key."
        )
    
    # Check if profile is complete
    if not all([profile.name, profile.degree, profile.qualifications, profile.skills, profile.cv_text]):
        raise HTTPException(
            status_code=400,
            detail="Profile incomplete. Please fill all required fields including CV upload."
        )
    
    # Prepare profile data
    profile_data = {
        "name": profile.name,
        "degree": profile.degree,
        "qualifications": profile.qualifications,
        "skills": profile.skills,
        "cv_text": profile.cv_text
    }
    
    # Call Gemini API
    gemini_service = GeminiService(profile.gemini_api_key)
    try:
        career_paths = await gemini_service.analyze_career_paths(profile_data)
        
        # Save analysis result
        analysis = CareerAnalysis(
            user_id=current_user.id,
            analysis_result_json=json.dumps(career_paths)
        )
        db.add(analysis)
        db.commit()
        
        return {"career_paths": career_paths}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing career paths: {str(e)}")

@app.post("/api/search-career")
async def search_career(
    request: CareerSearchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user profile
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Check if Gemini API key is set
    if not profile.gemini_api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API key not set. Please update your profile with a valid API key."
        )
    
    # Check if profile is complete
    if not all([profile.name, profile.degree, profile.qualifications, profile.skills, profile.cv_text]):
        raise HTTPException(
            status_code=400,
            detail="Profile incomplete. Please fill all required fields including CV upload."
        )
    
    # Prepare profile data
    profile_data = {
        "name": profile.name,
        "degree": profile.degree,
        "qualifications": profile.qualifications,
        "skills": profile.skills,
        "cv_text": profile.cv_text
    }
    
    # Call Gemini API
    gemini_service = GeminiService(profile.gemini_api_key)
    try:
        career_paths = await gemini_service.search_career_path(profile_data, request.career_query)
        return {"career_paths": career_paths}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching career path: {str(e)}")

@app.get("/api/analyses")
def get_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(CareerAnalysis).filter(
        CareerAnalysis.user_id == current_user.id
    ).order_by(CareerAnalysis.created_at.desc()).all()
    
    return {
        "analyses": [
            {
                "id": analysis.id,
                "created_at": analysis.created_at.isoformat(),
                "result": json.loads(analysis.analysis_result_json)
            }
            for analysis in analyses
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
