from decimal import Decimal

import pytest

from scripts.calculators.effective_rate import calculate_effective_rate


def test_effective_rate_with_capitalization():
    result = calculate_effective_rate(
        principal=Decimal("100000"),
        periods=[
            {
                "fromMonth": 0,
                "toMonth": 12,
                "annualRate": 12,
            },
        ],
        capitalization=True,
    )

    assert Decimal("12") < result < Decimal("13")


def test_effective_rate_without_capitalization():
    result = calculate_effective_rate(
        principal=Decimal("100000"),
        periods=[
            {
                "fromMonth": 0,
                "toMonth": 12,
                "annualRate": 12,
            },
        ],
        capitalization=False,
    )

    assert result == Decimal("12")


def test_effective_rate_with_multiple_periods():
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
        capitalization=False,
    )

    assert result == Decimal("11.25")


def test_invalid_periods():
    with pytest.raises(ValueError):
        calculate_effective_rate(
            principal=Decimal("100000"),
            periods=[
                {
                    "fromMonth": 0,
                    "toMonth": 3,
                    "annualRate": 15,
                },
                {
                    "fromMonth": 4,
                    "toMonth": 12,
                    "annualRate": 10,
                },
            ],
            capitalization=True,
        )


def test_invalid_principal():
    with pytest.raises(ValueError):
        calculate_effective_rate(
            principal=Decimal("0"),
            periods=[
                {
                    "fromMonth": 0,
                    "toMonth": 12,
                    "annualRate": 12,
                },
            ],
            capitalization=True,
        )