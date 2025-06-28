# middlewares.py
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import RedirectResponse

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        protected_paths = ["/store/form"]

        if request.url.path in protected_paths:
            user_id = request.cookies.get("user_id")
            if not user_id:
                return RedirectResponse("/login", status_code=302)

        response = await call_next(request)
        return response
