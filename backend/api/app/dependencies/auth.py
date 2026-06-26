from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.auth import CurrentUser
from app.services.supabase import SupabaseGateway, get_supabase_gateway

bearer_scheme = HTTPBearer(auto_error=False)


def _extract_bearer_token(credentials: HTTPAuthorizationCredentials | None) -> str:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )

    if credentials.scheme.lower() != "bearer" or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must be Bearer token",
        )

    return credentials.credentials


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    supabase: SupabaseGateway = Depends(get_supabase_gateway),
) -> CurrentUser:
    token = _extract_bearer_token(credentials)
    return await supabase.get_user_from_access_token(token)
