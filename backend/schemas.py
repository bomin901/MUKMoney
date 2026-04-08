from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class PreferenceSchema(BaseModel):
    disliked_foods: List[str]
    allergies: List[str]
    favorite_foods: List[str]
    spice_level: str

    class Config:
        from_attributes = True

class FoodRecordCreate(BaseModel):
    date: date
    mood: str
    food_name: str
    restaurant_name: str
    cost: float
    review_text: str
    map_link: Optional[str] = None
    # For photo handling, typically done via multipart/form-data.

    class Config:
        from_attributes = True

class FoodRecordResponse(FoodRecordCreate):
    id: int
    photo_url: Optional[str] = None
