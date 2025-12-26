from fastapi import APIRouter, HTTPException
from apps.backend.models.schemas import UserSignup, UserLogin, TokenResponse, UserResponse
from apps.backend.services.auth_service import hash_password, verify_password, create_access_token
from prisma import Prisma
from datetime import datetime

auth_router = APIRouter(tags=["Authentication"])
prisma = Prisma()


@auth_router.get("/test-db")
async def test_database_connection():
    """Test database connection"""
    try:
        # Test the existing connection with a simple query
        result = await prisma.query_raw("SELECT 1 as test")
        return {
            "status": "success",
            "message": "Database connection successful!",
            "result": result
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}"
        }


@auth_router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await prisma.user.find_unique(where={"email": user_data.email})
        
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user
        user = await prisma.user.create(
            data={
                "email": user_data.email,
                "password": hashed_password,
                "name": user_data.name
            }
        )
        
        # Create token
        access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
        
        # Prepare response
        user_response = UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            createdAt=user.createdAt.isoformat()
        )
        
        return TokenResponse(
            access_token=access_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")


@auth_router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login user and return JWT token"""
    try:
        # Find user by email
        user = await prisma.user.find_unique(where={"email": credentials.email})
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not verify_password(credentials.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
        
        # Prepare response
        user_response = UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            createdAt=user.createdAt.isoformat()
        )
        
        return TokenResponse(
            access_token=access_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
