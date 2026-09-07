import json
from decimal import Decimal
from pathlib import Path

from calculators.effective_rate import calculate_effective_rate
from calculators.interest import simple_interest
from calculators.real_rate import calculate_real_rate
from models.bank import Bank
from models.inflation import Inflation
from models.product import Product
from models.rate import ProductRate


ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
GENERATED_DIR = ROOT_DIR / "frontend" / "src" / "shared" / "data"


def load_json(filename: str):
    with open(DATA_DIR / filename, encoding="utf-8") as file:
        return json.load(file)


def save_json(filename: str, data):
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)

    with open(
        GENERATED_DIR / filename,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2,
        )


def generate():
    banks = [
        Bank.model_validate(item)
        for item in load_json("banks.json")
    ]

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

    banks_by_id = {
        bank.id: bank
        for bank in banks
    }

    rates_by_product = {
        rate.productId: rate
        for rate in rates
    }

    current_inflation = Decimal(
        str(inflation[-1].value)
    )

    generated_products = []

    for product in products:
        rate = rates_by_product.get(product.id)

        if rate is None:
            continue

        first_period = rate.periods[0]

        nominal_rate = Decimal(
            str(first_period.annualRate)
        )

        effective_rate = calculate_effective_rate(
            principal=Decimal("100000"),
            periods=[
                period.model_dump()
                for period in rate.periods
            ],
            capitalization=product.terms.capitalization,
        )

        real_rate = calculate_real_rate(
            nominal_rate=effective_rate,
            inflation_rate=current_inflation,
        )

        principal = Decimal("100000")

        if product.terms.capitalization:
            final_balance = principal

            for period in rate.periods:
                months = period.toMonth - period.fromMonth

                monthly_rate = (
                    Decimal(str(period.annualRate))
                    / Decimal("100")
                    / Decimal("12")
                )

                final_balance *= (
                    Decimal("1") + monthly_rate
                ) ** months

            profit = final_balance - principal

        else:
            total_profit = Decimal("0")

            for period in rate.periods:
                months = period.toMonth - period.fromMonth

                total_profit += simple_interest(
                    principal=principal,
                    annual_rate=Decimal(
                        str(period.annualRate)
                    ),
                    months=months,
                )

            profit = total_profit

        bank = banks_by_id[product.bankId]

        generated_products.append(
            {
                "id": product.id,
                "bank": {
                    "id": bank.id,
                    "name": bank.name,
                    "shortName": bank.shortName,
                    "website": str(bank.website),
                },
                "name": product.name,
                "type": product.type,
                "currency": product.currency,
                "minAmount": product.minAmount,
                "maxAmount": product.maxAmount,
                "termMonths": first_period.toMonth,
                "advertisedRate": float(nominal_rate),
                "effectiveRate": float(
                    effective_rate.quantize(
                        Decimal("0.01")
                    )
                ),
                "realRate": float(
                    real_rate.quantize(
                        Decimal("0.01")
                    )
                ),
                "profitFor100k": float(
                    profit.quantize(
                        Decimal("0.01")
                    )
                ),
                "capitalization": product.terms.capitalization,
                "replenishment": product.terms.replenishment,
                "partialWithdrawal": (
                    product.terms.partialWithdrawal
                ),
                "conditions": product.conditions.model_dump(),
                "status": product.status,
                "rateValidFrom": str(rate.validFrom),
            }
        )

    save_json(
        "deposits.json",
        {
            "generatedAt": "2026-09-07",
            "inflationRate": float(current_inflation),
            "products": generated_products,
        },
    )

    print("Data generation completed")
    print(f"Generated products: {len(generated_products)}")
    print(
        f"Output: {GENERATED_DIR / 'deposits.json'}"
    )


if __name__ == "__main__":
    generate()