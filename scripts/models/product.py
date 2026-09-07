from typing import Literal

from pydantic import BaseModel


class ProductTerms(BaseModel):
    replenishment: bool
    partialWithdrawal: bool
    capitalization: bool


class ProductOperations(BaseModel):
    earlyClosureAllowed: bool
    earlyClosureRate: float


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

    minAmount: float
    maxAmount: float | None

    terms: ProductTerms
    operations: ProductOperations
    conditions: ProductConditions

    status: Literal["active", "inactive"]