from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
from jose import jwt
from schemas.users import UserBase, UserResponse, Token

router = APIRouter()

# Конфигурация JWT
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Временное хранилище пользователей в памяти
fake_users_db = {
    "admin": {"username": "admin", "password": "admin123"},
    "user": {"username": "user", "password": "user123"}
}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/registration", status_code=status.HTTP_201_CREATED, response_model=UserResponse, tags=["Регистрация"])
async def register(user_data: UserBase):
    if user_data.username in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь существует"
        )
    
    # Сохраняем нового пользователя в памяти
    fake_users_db[user_data.username] = {
        "username": user_data.username,
        "password": user_data.password
    }
    
    return UserResponse(username=user_data.username)

@router.post("/auth", response_model=Token, tags=["Авторизация"])
async def auth(user_data: UserBase):
    user = fake_users_db.get(user_data.username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин"
        )
    
    if user["password"] != user_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль"
        )
    
    access_token = create_access_token(data={"sub": user_data.username})
    return Token(
        access_token=access_token,
        token_type="bearer",
        username=user_data.username
    )

# Эндпоинт для проверки токена
@router.get("/verify", tags=["Авторизация"])
async def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username in fake_users_db:
            return {"valid": True, "username": username}
        else:
            return {"valid": False}
    except jwt.JWTError:
        return {"valid": False}