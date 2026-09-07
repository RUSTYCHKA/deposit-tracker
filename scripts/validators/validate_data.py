import json
from pathlib import Path

from models.bank import Bank
from models.product import Product
from models.rate import ProductRate
from models.inflation import Inflation


ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"


def load_json(filename: str):
    with open(DATA_DIR / filename, encoding="utf-8") as file:
        return json.load(file)


def validate():
    banks = [Bank.model_validate(item) for item in load_json("banks.json")]
    products = [
        Product.model_validate(item)
        for item in load_json("products.json")
    ]
    rates = [
        ProductRate.model_validate(item)
        for item in load_json("rates.json")
    ]
    inflation = [
        Inflation.model_validate(item)
        for item in load_json("inflation.json")
    ]

    bank_ids = {bank.id for bank in banks}
    product_ids = {product.id for product in products}

    for product in products:
        if product.bankId not in bank_ids:
            raise ValueError(
                f"Unknown bank: {product.bankId}"
            )

    for rate in rates:
        if rate.productId not in product_ids:
            raise ValueError(
                f"Unknown product: {rate.productId}"
            )

    print("Data validation passed")
    print(f"Banks: {len(banks)}")
    print(f"Products: {len(products)}")
    print(f"Rates: {len(rates)}")
    print(f"Inflation records: {len(inflation)}")


if __name__ == "__main__":
    validate()