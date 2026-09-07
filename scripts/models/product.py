from decimal import Decimal
from typing import Literal

from pydantic import BaseModel

class ProductTerms(BaseModel):
    replenishment: bool
    partialWithdrawal: bool
    capitalization: bool


class ProductOperations(BaseModel):
    earlyClosureAllowed: bool
    earlyClosureRate: Decimal


class ProductConditions(BaseModel):
    newCustomer: bool
    cardRequired: bool
    monthlySpendingRequired: bool
    salaryProjectRequired: bool
    subscriptionRequired: bool
    onlineOpening: bool


class Product(BaseModel):
    id: str
    bankId: str
    name: str

    type: Literal["deposit", "savings-account"]
    currency: str

    minAmount: Decimal
    maxAmount: Decimal | None

    terms: ProductTerms
    operations: ProductOperations
    conditions: ProductConditions

    status: Literal["active", "inactive"]