import datetime as dt
from passlib.context import CryptContext
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.core.config import get_settings

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_ctx.verify(password, hashed)


async def authenticate(db: AsyncSession, email: str, password: str) -> User | None:
    res = await db.execute(select(User).where(User.email == email))
    user: User | None = res.scalar_one_or_none()
    if user and verify_password(password, user.hashed_password):
        return user
    return None


def create_access_token(subject: str) -> str:
    expire = dt.datetime.utcnow() + dt.timedelta(minutes=settings.access_token_expire_minutes)
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm="HS256")


def decode_access_token(token: str) -> str:
    payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    return payload["sub"]
