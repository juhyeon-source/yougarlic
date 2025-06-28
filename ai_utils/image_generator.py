from vertexai.preview.vision_models import ImageGenerationModel
import vertexai
import  os, io, base64
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv
load_dotenv("key.env")

GLE_API_KEY = os.getenv("GENAI_API_KEY")
SERVICE_ACCOUNT_KEY_PATH = os.getenv("SERVICE_ACCOUNT_KEY_PATH")
PROJECT_ID = os.getenv("PROJECT_ID")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = SERVICE_ACCOUNT_KEY_PATH
LOCATION = "us-central1"
FONT_PATH = "static/font/BMDOHYEON_ttf.ttf"

def add_text_to_image(image: Image.Image, store_name: str, subtitle: str) -> Image.Image:
    draw = ImageDraw.Draw(image)
    font_title = ImageFont.truetype(FONT_PATH, size=200)
    font_sub = ImageFont.truetype(FONT_PATH, size=50)

    img_width, img_height = image.size
    title_bbox = draw.textbbox((0, 0), store_name, font=font_title)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (img_width - title_width) / 2
    title_y = 80

    sub_bbox = draw.textbbox((0, 0), subtitle, font=font_sub)
    sub_width = sub_bbox[2] - sub_bbox[0]
    sub_x = (img_width - sub_width) / 2
    sub_y = title_y + title_bbox[3] + 20

    draw.text((title_x, title_y), store_name, font=font_title, fill="white")
    draw.text((sub_x, sub_y), subtitle, font=font_sub, fill="white")
    return image

def generate_image(prompt: str, store_name: str, slogan: str, main_item: str) -> list:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    model = ImageGenerationModel.from_pretrained("imagegeneration@006")

    os.makedirs("output", exist_ok=True)
    image_base64_list = []
    subtitle = f"{slogan}"
    max_attempts = 10
    idx = 0
    attempts = 0

    while len(image_base64_list) < 2 and attempts < max_attempts:
        response = model.generate_images(prompt=prompt, number_of_images=1, language="en")
        attempts += 1
        if not response.images:
            continue

        try:
            image_bytes = response.images[0]._image_bytes
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image_with_text = add_text_to_image(image, store_name, subtitle)

            output_path = f"output/generated_image_{idx}.png"
            image_with_text.save(output_path)

            with open(output_path, "rb") as f:
                img_base64 = base64.b64encode(f.read()).decode("utf-8")
                image_base64_list.append(img_base64)
                idx += 1
        except Exception:
            continue

    if len(image_base64_list) < 2:
        raise RuntimeError("이미지 생성 실패: 2장 생성 실패")

    return image_base64_list




from google.oauth2 import service_account
import vertexai

# 서비스 계정 키 경로 불러오기
SERVICE_ACCOUNT_KEY_PATH = "gen-lang-client-0101383492-67ae2707b8a1.json"  # 실제 경로로 바꿔주세요
PROJECT_ID = "gen-lang-client-0101383492"
LOCATION = "us-central1"

# 인증 객체 생성
credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_KEY_PATH)

# Vertex AI 초기화
vertexai.init(project=PROJECT_ID, location=LOCATION, credentials=credentials)

