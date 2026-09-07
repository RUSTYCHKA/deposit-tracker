from pydantic import BaseModel


class Inflation(BaseModel):
    date: str
    value: float
    source: str