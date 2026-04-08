from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import random
import json
import urllib.parse
from backend.database import get_db
from backend.models import Preference

router = APIRouter()

class RecommendRequest(BaseModel):
    mood: str

class RecommendResponse(BaseModel):
    food_name: str
    reason: str
    image_url: str

FOOD_DB = {
    "😡": ["닭발", "마라탕", "훠궈", "떡볶이"],
    "😊": ["케이크", "갈비찜", "잡채", "파스타"],
    "😢": ["칼국수", "죽", "라면", "국밥"],
    "😴": ["삼겹살", "치킨", "햄버거"],
    "🤒": ["죽", "삼계탕", "따뜻한 차"],
    "🥳": ["피자", "스테이크", "회", "치킨"],
    "🤔": ["돈까스", "김밥", "제육볶음"]
}

REASONS = {
    "😡": "스트레스 받을 땐 역시 매운맛이죠!",
    "😊": "기분 좋은 날엔 맛있는 음식을 더해서 완벽하게!",
    "😢": "우울할 땐 따뜻한 국물로 위로를 받아보세요.",
    "😴": "피곤할 땐 기름지고 든든한 음식이 최고예요.",
    "🤒": "아플 땐 위에 부담 없는 부드러운 음식이 좋아요.",
    "🥳": "신나는 날엔 특별한 음식으로 파티를 즐겨요!",
    "🤔": "고민될 땐 언제 먹어도 실패 없는 호불호 없는 메뉴로!"
}

@router.post("/", response_model=RecommendResponse)
def get_recommendation(req: RecommendRequest, db: Session = Depends(get_db)):
    mood = req.mood
    candidates = FOOD_DB.get(mood, ["치킨", "피자", "햄버거"])
    
    pref = db.query(Preference).first()
    if pref:
        disliked = json.loads(pref.disliked_foods)
        allergies = json.loads(pref.allergies)
        exclude_list = set(disliked + allergies)
        filtered = [food for food in candidates if food not in exclude_list]
        if filtered:
            candidates = filtered
            
    chosen = random.choice(candidates)
    encoded_query = urllib.parse.quote(chosen)
    # Using a placeholder image service
    image_url = f"https://image.pollinations.ai/prompt/delicious%20korean%20{encoded_query}%20food%20photography?width=400&height=300&nologo=true"
    
    return RecommendResponse(
        food_name=chosen,
        reason=REASONS.get(mood, "오늘 같은 날 딱 어울리는 메뉴예요!"),
        image_url=image_url
    )
