from pathlib import Path
import json

from models.bank import Bank
from models.product import Product


ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"


def load_json(filename: str):
    with open(DATA_DIR / filename, encoding="utf-8") as file:
        return json.load(file)


def test_banks_are_valid():
    banks = [
        Bank.model_validate(item)
        for item in load_json("banks.json")
    ]

    assert len(banks) > 0


def test_products_are_valid():
    products = [
        Product.model_validate(item)
        for item in load_json("products.json")
    ]

    assert len(products) > 0