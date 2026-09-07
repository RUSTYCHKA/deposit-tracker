from decimal import Decimal

from scripts.calculators.real_rate import calculate_real_rate


def test_real_rate():
    result = calculate_real_rate(
        nominal_rate=Decimal("14"),
        inflation_rate=Decimal("8"),
    )

    assert round(result, 2) == Decimal("5.56")