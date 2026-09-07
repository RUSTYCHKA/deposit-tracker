from decimal import Decimal


def calculate_real_rate(
    nominal_rate: Decimal,
    inflation_rate: Decimal,
) -> Decimal:
    """
    Расчет реальной доходности по вкладу используя формулу Фишера
    """

    if nominal_rate <= Decimal("-100"):
        raise ValueError("Номинальный доход должен быть выше чем -100%")

    if inflation_rate <= Decimal("-100"):
        raise ValueError("Инфляция должна быть выше -100%")

    nominal = nominal_rate / Decimal("100")
    inflation = inflation_rate / Decimal("100")

    real = (
        (Decimal("1") + nominal)
        / (Decimal("1") + inflation)
        - Decimal("1")
    )

    return real * Decimal("100")