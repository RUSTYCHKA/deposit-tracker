from decimal import Decimal


def calculate_effective_rate(
    principal: Decimal,
    periods: list[dict],
) -> Decimal:
    """
    Рассчет эффективной доходности по вкладу со ступенчатой ставкой
    """

    balance = principal
    total_months = 0

    for period in periods:
        from_month = period["fromMonth"]
        to_month = period["toMonth"]
        annual_rate = Decimal(str(period["annualRate"]))

        months = to_month - from_month

        if months <= 0:
            raise ValueError("Неверный срок вклада")

        monthly_rate = annual_rate / Decimal("100") / Decimal("12")

        balance *= (
            Decimal("1") + monthly_rate
        ) ** months

        total_months += months

    if total_months <= 0:
        raise ValueError("Неверный итоговый срок")

    years = Decimal(total_months) / Decimal("12")

    effective_rate = (
        (balance / principal) ** (Decimal("1") / years)
        - Decimal("1")
    ) * Decimal("100")

    return effective_rate