from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from api.models.spravochnik import Spravochnik
from api.database import get_db
from api.schemas.spravochnik import SpravochnikResponse

from api.auth.oauth2 import get_current_user
from api.utils.roles import role_required


router = APIRouter(prefix="/spravochnik", tags=["Spravochnik"])




@router.get("/{type}", response_model=List[SpravochnikResponse])
def read_spravochnik_by_type(type: str, db: Session = Depends(get_db)):
    """
    Загружает элементы справочника по типу entity_name.
    Например:
    GET /spravochnik/ModelTechnique → модели техники
    GET /spravochnik/FailureNode   → узлы отказа
    """
    result = db.query(Spravochnik).filter(Spravochnik.entity_name == type).all()
    if not result:
        raise HTTPException(status_code=404, detail="Справочник пуст или не найден")

    return result
