from decimal import Decimal

from scripts.calculators.effective_rate import calculate_effective_rate


def test_effective_rate():
    result = calculate_effective_rate(
        principal=Decimal("100000"),
        periods=[
            {
                "fromMonth": 0,
                "toMonth": 3,
                "annualRate": 15,
            },
            {
                "fromMonth": 3,
                "toMonth": 12,
                "annualRate": 10,
            },
        ],
    )

    assert Decimal("10") < result < Decimal("13")