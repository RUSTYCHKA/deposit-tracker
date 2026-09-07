from datetime import date

from pydantic import BaseModel


class RatePeriod(BaseModel):
    fromMonth: int
    toMonth: int
    annualRate: float


class RateSource(BaseModel):
    type: str
    url: str | None
    checkedAt: date


class ProductRate(BaseModel):
    productId: str

    validFrom: date
    validTo: date | None

    periods: list[RatePeriod]

    source: RateSource