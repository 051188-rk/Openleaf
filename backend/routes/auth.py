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


@auth_router.post("/test-signup-simple")
async def test_signup_simple(user_data: UserSignup):
    """Simple signup test without error handling"""
    from apps.backend.services.auth_service import hash_password
    
    # Just hash the password and return
    try:
        hashed = hash_password(user_data.password)
        return {"message": "Password hashed successfully", "length": len(hashed)}
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}


@auth_router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserSignup):
    """Register a new user"""
    try:
        print(f"Signup attempt for email: {user_data.email}")
        
        # Check if user already exists
        existing_user = await prisma.user.find_unique(where={"email": user_data.email})
        
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        print("Hashing password...")
        # Hash password
        hashed_password = hash_password(user_data.password)
        print(f"Password hashed successfully")
        
        # Create user
        print("Creating user in database...")
        user = await prisma.user.create(
            data={
                "email": user_data.email,
                "password": hashed_password,
                "name": user_data.name
            }
        )
        print(f"User created: {user.id}")
        
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
        print(f"SIGNUP ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
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
