from pydantic import BaseModel, HttpUrl


class Bank(BaseModel):
    id: str
    name: str
    shortName: str
    website: HttpUrl