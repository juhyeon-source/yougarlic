from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from ai_utils.text_utils import translate_text
from ai_utils.image_generator import generate_image
import os

router = APIRouter()

class CreateFlyerRequest(BaseModel):
    store_name: str
    slogan: str
    main_item: str

@router.post("/create")
async def create_flyer(request: CreateFlyerRequest):
    try:
        # 1. 텍스트 번역
        korean_text = f"저희 가게는 {request.store_name}입니다. {request.slogan} 대표상품은 {request.main_item}입니다."
        english_prompt = translate_text(korean_text)

        # 2. 이미지 생성 및 output 폴더에 저장
        generate_image(english_prompt, request.store_name, request.slogan, request.main_item)

        # 3. 프론트에서 접근할 수 있도록 이미지 URL 반환
        image_urls = [
            "http://localhost:8000/static/generated_image_0.png",
            "http://localhost:8000/static/generated_image_1.png"
        ]

        return JSONResponse(content={"image_urls": image_urls})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    

'''
curl -X POST "http://127.0.0.1:8000/create" -H "Content-Type: application/json" -d "{\"store_name\":\"야호제과점\",\"slogan\":\"매일 아침 갓 구운 빵 드세요!!\",\"main_item\":\"식빵\"}"
'''
