from decimal import Decimal

from scripts.calculators.interest import simple_interest


def test_simple_interest():
    result = simple_interest(
        principal=Decimal("100000"),
        annual_rate=Decimal("12"),
        months=12,
    )

    assert result == Decimal("12000")


def test_simple_interest_six_months():
    result = simple_interest(
        principal=Decimal("100000"),
        annual_rate=Decimal("12"),
        months=6,
    )

    assert result == Decimal("6000")