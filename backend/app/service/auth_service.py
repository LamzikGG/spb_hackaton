from sqlalchemy.orm import Session
from models.users import User
from schemas.users import UserBase

class AuthService:
    @staticmethod
    def get_user_by_username(db: Session, username: str):
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def create_user(db: Session, user_data: UserBase):
        user = User(username=user_data.username, password=user_data.password)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user