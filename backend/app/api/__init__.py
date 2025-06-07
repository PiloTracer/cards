from fastapi import APIRouter
from .endpoints import auth, companies, users, employee_records, cards
router = APIRouter()

router.include_router(auth.router)
router.include_router(companies.router)
router.include_router(users.router)
router.include_router(employee_records.router)
router.include_router(cards.router)

@router.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
