from decimal import Decimal


def calculate_effective_rate(
    principal: Decimal,
    periods: list[dict],
    capitalization: bool = True,
) -> Decimal:
    """
    Calculate effective annualized rate for a deposit.

    If capitalization is enabled, interest is reinvested.
    Otherwise, interest is calculated without capitalization.
    """
    if principal <= 0:
        raise ValueError("Principal must be greater than zero")

    if not periods:
        raise ValueError("Periods cannot be empty")

    periods = sorted(
        periods,
        key=lambda period: period["fromMonth"],
    )

    total_months = 0

    for index, period in enumerate(periods):
        from_month = period["fromMonth"]
        to_month = period["toMonth"]

        if from_month < 0:
            raise ValueError("fromMonth cannot be negative")

        if to_month <= from_month:
            raise ValueError("Invalid rate period")

        if index > 0:
            previous = periods[index - 1]

            if from_month != previous["toMonth"]:
                raise ValueError("Rate periods must be contiguous")

        total_months += to_month - from_month

    balance = principal

    if capitalization:
        for period in periods:
            months = period["toMonth"] - period["fromMonth"]

            annual_rate = Decimal(
                str(period["annualRate"])
            )

            monthly_rate = (
                annual_rate
                / Decimal("100")
                / Decimal("12")
            )

            balance *= (
                Decimal("1") + monthly_rate
            ) ** months

    else:
        total_interest = Decimal("0")

        for period in periods:
            months = period["toMonth"] - period["fromMonth"]

            annual_rate = Decimal(
                str(period["annualRate"])
            )

            total_interest += (
                principal
                * annual_rate
                / Decimal("100")
                * Decimal(months)
                / Decimal("12")
            )

        balance += total_interest

    years = Decimal(total_months) / Decimal("12")

    effective_rate = (
        (balance / principal)
        ** (Decimal("1") / years)
        - Decimal("1")
    ) * Decimal("100")

    return effective_rate