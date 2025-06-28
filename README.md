# Garlic Backend

📦 FastAPI 기반 지역 가게 등록 서비스 백엔드입니다.

📝 사전 설정 (Prerequisites)
중요: 이 프로젝트가 올바르게 작동하려면 다음 파일들을 수동으로 생성해야 합니다. 이 파일들은 민감한 정보(API 키, 설정 값 등)를 포함하고 있어 Git 저장소에 포함되지 않습니다.

Backend (/)
루트 디렉토리에 아래 파일들을 생성해 주세요.

C:\garlic_back\yougarlic\firebase_key.json

C:\garlic_back\yougarlic\gen-lang-client-0101383492-67ae2707b8a1.json

key.env

※ .json 파일들은 특정 설정 데이터를, key.env와 .env파일은 주요 API 키 또는 비밀 값을 관리합니다.

Frontend
프론트엔드 프로젝트 폴더에 아래 파일을 생성해 주세요.

.env

※ 프론트엔드에서 사용하는 환경 변수를 정의합니다.

🛠️ 설치 (Installation)
1.Python 가상 환경을 생성하고 활성화합니다.

python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .\.venv\Scripts\activate # Windows

2.필요한 패키지를 설치합니다.
아래 명령어를 사용하여 모든 필수 패키지를 한 번에 설치할 수 있습니다.
```bash
pip install -r requirements.txt
```
참고: requirements.txt 파일이 없는 경우, 다음 명령어로 직접 설치할 수 있습니다.
pip install fastapi uvicorn python-multipart jinja2 pydantic

▶️ 실행 (Execution)
개발 서버를 실행하려면 아래 명령어를 입력하세요.
```bash
uvicorn main:app --reload
```
main: main.py 파일을 의미합니다.

app: main.py 파일 내의 FastAPI 애플리케이션 객체입니다.

--reload: 코드 변경 시 서버를 자동으로 재시작하는 개발용 옵션입니다.

📋 등록 예시 (Example)

| 필드명           | 값 |
|------------------|-----|
| 상점 이름     | 너마늘김밥천국 |
| 한줄 소개    | 이곳은 마늘을 활용한 특별한 메뉴로 가득한 따뜻한 공간입니다. |
| 위치         | 경상북도 의성군 옥산면 마늘로 123 |
| Google Map URL | [https://maps.google.com/?q=37.5665,126.9780](https://maps.google.com/?q=37.5665,126.9780) |
| 대표 상품    | 마늘떡볶이 |

> 위 내용을 입력하고 [등록하기] 버튼을 누르면 등록 완료 화면이 출력됩니다.
📦 설치된 주요 모듈
이 프로젝트는 다음의 주요 Python 패키지들을 사용합니다.
패키지 이름	설명
fastapi	웹 프레임워크
uvicorn	ASGI 서버 (개발용 핫 리로딩 포함)
python-multipart	HTML Form 데이터 처리용 (FastAPI의 Form 사용 시 필수)
jinja2	템플릿 렌더링 엔진
pydantic	데이터 검증 및 유효성 검사 (Form 검증에 사용)
aiofiles (선택)	파일 업로드가 필요한 경우 사용할 수 있음
httpx (선택)	비동기 HTTP 요청 (필요 시)
starlette	FastAPI 내부 기반 프레임워크 (fastapi에 포함)
