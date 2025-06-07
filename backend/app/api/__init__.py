from fastapi import APIRouter
from .endpoints import auth, companies, users, collab_cards, cards
router = APIRouter()

router.include_router(auth.router)
router.include_router(companies.router)
router.include_router(users.router)
router.include_router(collab_cards.router)
router.include_router(cards.router)

@router.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
