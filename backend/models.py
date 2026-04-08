from sqlalchemy import Column, Integer, String, Float, Date
from backend.database import Base

class Preference(Base):
    __tablename__ = "preferences"
    id = Column(Integer, primary_key=True, index=True)
    disliked_foods = Column(String, default="[]")  # stored as JSON string
    allergies = Column(String, default="[]")       # stored as JSON string
    favorite_foods = Column(String, default="[]")  # stored as JSON string
    spice_level = Column(String, default="normal")

class FoodRecord(Base):
    __tablename__ = "food_records"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    mood = Column(String)
    food_name = Column(String)
    restaurant_name = Column(String)
    cost = Column(Float)
    review_text = Column(String)
    photo_url = Column(String, nullable=True)
    map_link = Column(String, nullable=True)
