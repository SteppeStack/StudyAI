from fastapi import Depends, Header, HTTPException, status

from app.schemas.auth import CurrentUser
from app.services.supabase import SupabaseGateway, get_supabase_gateway


def _extract_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must be Bearer token",
        )

    return token


async def get_current_user(
    authorization: str | None = Header(default=None),
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
) -> CurrentUser:
    token = _extract_bearer_token(authorization)
    return await supabase.get_user_from_access_token(token)
