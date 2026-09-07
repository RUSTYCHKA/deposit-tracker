from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class RatePeriod(BaseModel):
    fromMonth: int
    toMonth: int
    annualRate: Decimal


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