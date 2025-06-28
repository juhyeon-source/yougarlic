from fastapi import FastAPI, Request, Form, Body
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator, HttpUrl
from firebase_config import db
from passlib.hash import bcrypt
from passlib.context import CryptContext
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import re


app = FastAPI()

# 로그인 체크용 미들웨어 정의
class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        protected_paths = ["/store/form"]  # 로그인 필요 경로

        if request.url.path in protected_paths:
            user_id = request.cookies.get("user_id")
            if not user_id:
                return RedirectResponse("/login", status_code=302)

        response = await call_next(request)
        return response

# 미들웨어 등록
app.add_middleware(AuthMiddleware)

templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return '홈화면입니다!'

class Store(BaseModel):
    name : str = Field(..., description="가게 이름")
    introduce : str = Field(..., max_length=1000, description="가게를 소개하는 글 (최소 10자 이상)")
    location : str = Field(..., description="가게 위치")
    google_map_url : str = Field(..., description="구글 지도 퍼가기 링크")
    product : str = Field(..., description="가게 대표 상품")
    time: str = Field(..., description="운영 시간 (예: 09시~22시)")
    rest: str = Field(..., description="휴무일 (예: 매주 화요일)")

    @field_validator('location')
    @classmethod
    def validate_location(cls, v):
        if not re.match(r'^경상북도 의성군\s.+면', v):
            raise ValueError('주소는 "경상북도 의성군 **면 ..." 형식이어야 합니다.')
        return v

    @field_validator('google_map_url')
    @classmethod
    def validate_google_map_url(cls, v: str):
        # 여기서 추출하도록 수정
        match = re.search(r'src=["\']([^"\']+)["\']', v)
        src_url = match.group(1) if match else v

        if not ("google.com/maps/embed" in src_url or "goo.gl/maps" in src_url):
            raise ValueError("구글 지도 퍼가기 링크여야 합니다.")
        return src_url


@app.get("/store/form")
def store_form(request: Request):
    return templates.TemplateResponse("store_form.html", {"request" : request})

def extract_src_from_iframe(iframe_html: str) -> str:
    """iframe 문자열에서 src URL만 추출"""
    match = re.search(r'src=["\']([^"\']+)["\']', iframe_html)
    return match.group(1) if match else iframe_html

@app.post("/store/submit")
def submit_store(
    request : Request,
    name : str = Form(..., description="가게 이름"),
    introduce : str = Form(..., max_length=1000, description="가게를 소개하는 글 (최소 10자 이상)"),
    location : str = Form(..., description="가게 위치 ('경상북도 의성군 **면 ...' 형식으로 작성해주세요.)"),
    google_map_url : str = Form(..., description="구글 지도 퍼가기 링크"),
    product : str = Form(..., description="가게 대표 상품") ,
    time: str = Form(..., description="가게 운영 시간"),
    rest: str = Form(..., description="휴무일")
):

    try:
        store = Store(
            name = name,
            introduce = introduce,
            location = location,
            google_map_url = google_map_url,
            product = product,
            time=time,
            rest=rest
        )
    except Exception as e:
        error_msg = str(e)
        if "google_map_url" in error_msg:
            error_msg = "구글 지도 퍼가기 링크를 제대로 입력했는지 확인해주세요."
    
        return templates.TemplateResponse("store_form.html", {
            "request": request,
            "error": error_msg,
            "old" : {
                "name" : name,
                "introduce" : introduce,
                "location" : location,
                "google_map_url" : google_map_url,
                "product" : product,
                "time": time,
                "rest": rest
            }
        })

    try:
        user_id = request.cookies.get("user_id")
        db.collection("stores").add({
            **store.model_dump(mode="json"),
            "user_id": user_id
        })

        # 작성자 닉네임 불러오기
        user_docs = db.collection("users").where("id", "==", user_id).get()
        nickname = user_docs[0].to_dict().get("nickname", "알 수 없음") if user_docs else "알 수 없음"

    except Exception as e:
        return templates.TemplateResponse("store_form.html", {
            "request": request,
            "error": f"Firestore 저장 오류: {str(e)}",
            "old": store.model_dump()
        })

    return templates.TemplateResponse("store_detail.html", {
        "request": request,
        "store": store,
        "nickname": nickname 
    })


# 회원가입
@app.get("/signup")
def signup_form(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})


@app.post("/signup")
async def signup(
    request: Request, 
    name: str = Form(...),
    nickname: str = Form(...),
    id: str = Form(...), 
    password: str = Form(...),
    password_check: str = Form(...),
    birthday: str = Form(...),
    phone_number: str = Form(...)
    ):

    form_data = await request.form()

    # 비밀번호 일치 확인
    if password != password_check:
        return templates.TemplateResponse("signup.html", {
            "request": request,
            "error": "비밀번호가 일치하지 않습니다.",
            "old": form_data
        })


    # 주민번호 앞자리 형식 검사: YYMMDD-X
    if not re.match(r"^\d{6}-\d{1}$", birthday):
        return templates.TemplateResponse("signup.html", {
            "request": request,
            "error": "생년월일 형식이 올바르지 않습니다. 예: 990101-1",
            "old": form_data
        })

    # 전화번호 형식 검사: 000-0000-0000
    if not re.match(r"^\d{3}-\d{4}-\d{4}$", phone_number):
        return templates.TemplateResponse("signup.html", {
            "request": request,
            "error": "전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678",
            "old": form_data
        })

    # 닉네임 중복 검사
    user_ref = db.collection("users").where("nickname", "==", nickname).get()
    if user_ref:
        return templates.TemplateResponse("signup.html", {
            "request": request,
            "error": "이미 가입된 닉네임입니다.",
            "old": form_data
        })

    # 아이디 중복 검사
    user_ref = db.collection("users").where("id", "==", id).get()
    if user_ref:
        return templates.TemplateResponse("signup.html", {
            "request": request,
            "error": "이미 가입된 아이디입니다.",
            "old": form_data
        })

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_pw = pwd_context.hash(password)

    db.collection("users").add({
        "name": name,
        "nickname": nickname,
        "id": id,
        "password": hashed_pw,
        "birthday": birthday + "******",  # 뒤는 마스킹
        "phone_number": phone_number
    })

    return RedirectResponse("/login", status_code=302)



# 로그인
@app.get("/login")
def login_form(request: Request):
    user_id = request.cookies.get("user_id")
    if user_id:
        # 이미 로그인 되어 있으면 홈으로
        return RedirectResponse("/", status_code=302)
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/login")
def login(
    request: Request, 
    id: str = Form(...), 
    password: str = Form(...)
    ):

    users = db.collection("users").where("id", "==", id).get()
    if not users:
        return templates.TemplateResponse("login.html", {
            "request": request,
            "error": "존재하지 않는 아이디입니다."
        })
 
    user_data = users[0].to_dict()
    if not bcrypt.verify(password, user_data["password"]):
        return templates.TemplateResponse("login.html", {
            "request": request,
            "error": "비밀번호가 일치하지 않습니다."
        })

    # 로그인 성공 → 세션 쿠키 설정
    response = RedirectResponse("/", status_code=302)
    response.set_cookie(key="user_id", value=id)
    return response


# 로그아웃
@app.get("/logout")
def logout():
    response = RedirectResponse("/", status_code=302)
    response.delete_cookie("user_id")
    return response



# 로그인 상태 확인
@app.get("/profile")
def profile(request: Request):
    user_id = request.cookies.get("user_id")
    if not user_id:
        return RedirectResponse("/login", status_code=302)

    users = db.collection("users").where("id", "==", user_id).get()
    if not users:
        return RedirectResponse("/login", status_code=302)

    user_data = users[0].to_dict()

    return templates.TemplateResponse("profile.html", {
        "request": request,
        "id": user_id,
        "user": user_data  # <- signup에 유저 정보 전달
    })


@app.get("/api/profile")
def get_profile(request: Request):
    user_id = request.cookies.get("user_id")
    if not user_id:
        return JSONResponse(status_code=401, content={"error": "Not logged in"})

    users = db.collection("users").where("id", "==", user_id).get()
    if not users:
        return JSONResponse(status_code=404, content={"error": "User not found"})

    user_data = users[0].to_dict()
    return JSONResponse(content={
        "nickname": user_data["nickname"],
        "name": user_data["name"],  # username으로 사용됨
        "id": user_data["id"],
        "birthday": user_data["birthday"],
        "phone_number": user_data["phone_number"]
    })


@app.put("/api/profile")
async def update_api_profile(
    request: Request,
    data: dict = Body(...)
):
    user_id = request.cookies.get("user_id")
    if not user_id:
        return JSONResponse(status_code=401, content={"error": "로그인되지 않았습니다."})

    user_docs = db.collection("users").where("id", "==", user_id).get()
    if not user_docs:
        return JSONResponse(status_code=404, content={"error": "사용자를 찾을 수 없습니다."})

    user_ref = user_docs[0].reference

    try:
        update_data = {}
        if "nickname" in data:
            update_data["nickname"] = data["nickname"]

        if "password" in data and data["password"]:
            # 비밀번호 변경 요청이 있을 경우 해싱 후 저장
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            hashed_pw = pwd_context.hash(data["password"])
            update_data["password"] = hashed_pw

        user_ref.update(update_data)
        return JSONResponse(content={"message": "정보가 성공적으로 수정되었습니다."})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"수정 중 오류 발생: {str(e)}"})


@app.get("/my-posts")
def my_posts(request: Request):
    user_id = request.cookies.get("user_id")
    if not user_id:
        return RedirectResponse("/login", status_code=302)

    user_docs = db.collection("users").where("id", "==", user_id).get()
    if not user_docs:
        return RedirectResponse("/login", status_code=302)
    user_data = user_docs[0].to_dict()

    posts = db.collection("stores").where("user_id", "==", user_id).get()
    post_list = [{"id": doc.id, **doc.to_dict()} for doc in posts]  # ← 문서 ID 포함

    return templates.TemplateResponse("my_posts.html", {
        "request": request,
        "nickname": user_data.get("nickname", "사용자"),
        "posts": post_list
    })


@app.post("/my-posts/delete/{post_id}")
def delete_my_post(post_id: str, request: Request):
    user_id = request.cookies.get("user_id")
    if not user_id:
        return RedirectResponse("/login", status_code=302)

    post_ref = db.collection("stores").document(post_id)
    post = post_ref.get()

    if not post.exists:
        return JSONResponse(status_code=404, content={"error": "게시글이 존재하지 않습니다."})

    post_data = post.to_dict()
    if post_data.get("user_id") != user_id:
        return JSONResponse(status_code=403, content={"error": "삭제 권한이 없습니다."})

    post_ref.delete()
    return RedirectResponse("/my-posts", status_code=302)




@app.get("/posts")
def all_posts(request: Request):
    posts = db.collection("stores").get()
    post_list = []

    for doc in posts:
        post = doc.to_dict()

        # 작성자 닉네임 조회
        user_id = post.get("user_id")
        user_docs = db.collection("users").where("id", "==", user_id).get()
        nickname = user_docs[0].to_dict().get("nickname", "알 수 없음") if user_docs else "알 수 없음"
        post["nickname"] = nickname

        post_list.append(post)

    return templates.TemplateResponse("all_posts.html", {
        "request": request,
        "posts": post_list
    })


@app.get("/api/posts")
def get_all_posts():
    posts = db.collection("stores").get()
    post_list = []

    for doc in posts:
        post = doc.to_dict()

        user_id = post.get("user_id")
        user_docs = db.collection("users").where("id", "==", user_id).get()
        nickname = user_docs[0].to_dict().get("nickname", "알 수 없음") if user_docs else "알 수 없음"
        post["nickname"] = nickname
        post["id"] = doc.id  # ← 필요시 클라이언트에서 삭제 등 활용 가능

        post_list.append(post)

    return JSONResponse(content=post_list)




@app.get("/api/posts/{post_id}")
def get_post(post_id: str):
    doc = db.collection("stores").document(post_id).get()

    if not doc.exists:
        return JSONResponse(status_code=404, content={"error": "해당 상점을 찾을 수 없습니다."})

    post = doc.to_dict()
    post["id"] = doc.id

    user_id = post.get("user_id")
    user_docs = db.collection("users").where("id", "==", user_id).get()
    nickname = user_docs[0].to_dict().get("nickname", "알 수 없음") if user_docs else "알 수 없음"
    post["nickname"] = nickname

    return JSONResponse(content=post)


@app.get("/api/posts/get_post_id/")
def get_post_id_by_store_name(name: str):
    name_stripped = name.strip()
    print(f"[DEBUG] 요청 받은 name = {name_stripped!r}")

    query = db.collection("stores").where("name", "==", name_stripped).get()
    docs = [doc for doc in query]

    if len(docs) == 0:
        print("[DEBUG] 🔍 Firestore에 해당 이름 문서 없음")
        return JSONResponse(status_code=404, content={"error": "해당 상점이 없습니다."})

    print(f"[DEBUG] 찾은 문서 개수: {len(docs)}")
    for doc in docs:
        print(f"[DEBUG] 문서 ID: {doc.id}, name: {doc.to_dict().get('name')!r}")

    return JSONResponse(content={"post_id": docs[0].id})


@app.get("/api/posts/search")
def search_store_by_name(name: str):
    query = db.collection("stores").where("name", "==", name).get()
    if not query:
        return JSONResponse(status_code=404, content={"error": "해당 이름의 상점이 존재하지 않습니다."})

    doc = query[0]
    return JSONResponse(content={"id": doc.id})


@app.get("/edit-profile")
def edit_profile(request: Request):
    user_id = request.cookies.get("user_id")
    if not user_id:
        return RedirectResponse("/login", status_code=302)

    user_docs = db.collection("users").where("id", "==", user_id).get()
    if not user_docs:
        return RedirectResponse("/login", status_code=302)

    user_data = user_docs[0].to_dict()

    return templates.TemplateResponse("edit_profile.html", {
        "request": request,
        "user": user_data
    })


@app.post("/edit-profile")
async def update_profile(
    request: Request,
    name: str = Form(...),
    nickname: str = Form(...),
    phone_number: str = Form(...)
):
    user_id = request.cookies.get("user_id")
    if not user_id:
        return RedirectResponse("/login", status_code=302)

    form_data = await request.form()

    # 전화번호 형식 검사
    if not re.match(r"^\d{3}-\d{4}-\d{4}$", phone_number):
        return templates.TemplateResponse("edit_profile.html", {
            "request": request,
            "user": form_data,
            "error": "전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678"
        })

    try:
        user_docs = db.collection("users").where("id", "==", user_id).get()
        if not user_docs:
            return RedirectResponse("/login", status_code=302)

        user_ref = user_docs[0].reference
        user_ref.update({
            "name": name,
            "nickname": nickname,
            "phone_number": phone_number
        })

    except Exception as e:
        return templates.TemplateResponse("edit_profile.html", {
            "request": request,
            "user": form_data,
            "error": f"정보 수정 중 오류 발생: {str(e)}"
        })

    return RedirectResponse("/profile", status_code=302)
