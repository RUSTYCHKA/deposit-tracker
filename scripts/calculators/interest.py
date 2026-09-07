from decimal import Decimal


def simple_interest(
    principal: Decimal,
    annual_rate: Decimal,
    months: int,
) -> Decimal:
    """
    Рассчет доходности по вкладу без капитализации
    """

    if principal < 0:
        raise ValueError("Первоначальная сумма вклада не может быть отрицательной")

    if annual_rate < 0:
        raise ValueError("Ставка не может быть отрицательный")

    if months < 0:
        raise ValueError("Срок вклада не может быть отрицательным")

    return principal * annual_rate / Decimal("100") * Decimal(months) / Decimal("12")


from decimal import Decimal


def compound_interest(
    principal: Decimal,
    annual_rate: Decimal,
    months: int,
    capitalization_periods_per_year: int = 12,
) -> Decimal:
    """
    Расчет дохода по вкладу с капитализацией
    """

    if principal < 0:
        raise ValueError("Первоначальная сумма вклада не может быть отрицательной")

    if annual_rate < 0:
        raise ValueError("Ставка не может быть отрицательной")

    if months < 0:
        raise ValueError("Срок вклада не может быть отрицательным")

    if capitalization_periods_per_year <= 0:
        raise ValueError(
            "Срок капитализации не может быть отрицательным"
        )

    periods = Decimal(months) / Decimal("12") * Decimal(
        capitalization_periods_per_year
    )

    periodic_rate = (
        annual_rate / Decimal("100")
        / Decimal(capitalization_periods_per_year)
    )

    return principal * (
        Decimal("1") + periodic_rate
    ) ** periods