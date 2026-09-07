from pydantic import BaseModel
from decimal import Decimal


class Inflation(BaseModel):
    date: str
    value: Decimal
    source: str