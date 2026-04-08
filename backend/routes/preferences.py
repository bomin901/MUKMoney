from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from backend.database import get_db
from backend.models import Preference
from backend.schemas import PreferenceSchema

router = APIRouter()

@router.get("/", response_model=PreferenceSchema)
def get_preferences(db: Session = Depends(get_db)):
    pref = db.query(Preference).first()
    if not pref:
        return PreferenceSchema(disliked_foods=[], allergies=[], favorite_foods=[], spice_level="normal")
    return PreferenceSchema(
        disliked_foods=json.loads(pref.disliked_foods),
        allergies=json.loads(pref.allergies),
        favorite_foods=json.loads(pref.favorite_foods),
        spice_level=pref.spice_level
    )

@router.post("/", response_model=PreferenceSchema)
def save_preferences(prefs: PreferenceSchema, db: Session = Depends(get_db)):
    db_pref = db.query(Preference).first()
    if not db_pref:
        db_pref = Preference()
        db.add(db_pref)
    
    db_pref.disliked_foods = json.dumps(prefs.disliked_foods)
    db_pref.allergies = json.dumps(prefs.allergies)
    db_pref.favorite_foods = json.dumps(prefs.favorite_foods)
    db_pref.spice_level = prefs.spice_level
    
    db.commit()
    db.refresh(db_pref)
    return prefs
