from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date
import shutil
import os
import uuid
from backend.database import get_db
from backend.models import FoodRecord
from backend.schemas import FoodRecordResponse

router = APIRouter()
UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/records", response_model=FoodRecordResponse)
def create_record(
    date: date = Form(...),
    mood: str = Form(...),
    food_name: str = Form(...),
    restaurant_name: str = Form(...),
    cost: float = Form(...),
    review_text: str = Form(...),
    map_link: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    photo_url = None
    if photo:
        ext = photo.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        photo_url = f"/uploads/{filename}"
        
    db_record = FoodRecord(
        date=date,
        mood=mood,
        food_name=food_name,
        restaurant_name=restaurant_name,
        cost=cost,
        review_text=review_text,
        map_link=map_link,
        photo_url=photo_url
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/records", response_model=List[FoodRecordResponse])
def get_records(db: Session = Depends(get_db)):
    return db.query(FoodRecord).order_by(FoodRecord.date.desc()).all()

@router.get("/calendar")
def get_calendar_stats(month: int = None, year: int = None, db: Session = Depends(get_db)):
    records = db.query(FoodRecord).all()
    
    daily_stats = {}
    total_cost = 0
    food_counts = {}
    
    for r in records:
        if month and year:
            if r.date.month != month or r.date.year != year:
                continue
                
        date_str = r.date.strftime("%Y-%m-%d")
        if date_str not in daily_stats:
            daily_stats[date_str] = {"foods": [], "cost": 0, "moods": []}
            
        daily_stats[date_str]["foods"].append(r.food_name)
        daily_stats[date_str]["cost"] += r.cost
        daily_stats[date_str]["moods"].append(r.mood)
        
        total_cost += r.cost
        food_counts[r.food_name] = food_counts.get(r.food_name, 0) + 1
        
    most_eaten = None
    if food_counts:
        most_eaten = max(food_counts, key=food_counts.get)
        
    return {
        "daily": daily_stats,
        "monthly_total_cost": total_cost,
        "most_eaten_food": most_eaten
    }
