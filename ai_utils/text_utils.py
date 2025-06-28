import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv("key.env")
GOOGLE_API_KEY = os.getenv("GENAI_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)


def translate_text(korean_text: str) -> str:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        prompt = (
            f"Translate \"{korean_text}\" into an English description suitable. "
            f"Simple illustration format. "
            f"Solid color background. "
            f"Skewed to the bottom. "
            f"Empty topside. "
        )
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise RuntimeError(f"Gemini 번역 오류: {e}")
