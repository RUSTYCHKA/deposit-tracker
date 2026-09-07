import type { Deposit } from '@/entities/deposit';

export interface DepositCalculation {
  principal: number;
  interest: number;
  finalBalance: number;
  realProfit: number;
}

export function calculateProfit(
  deposit: Deposit,
  principal: number,
  inflationRate: number,
): DepositCalculation {
  const months = deposit.termMonths;

  if (principal <= 0 || months <= 0) {
    return {
      principal,
      interest: 0,
      finalBalance: principal,
      realProfit: 0,
    };
  }

  let finalBalance = principal;

  for (const period of deposit.ratePeriods) {
    const monthsInPeriod =
      period.toMonth - period.fromMonth;

    if (deposit.capitalization) {
      const monthlyRate =
        period.annualRate / 100 / 12;

      finalBalance *= Math.pow(
        1 + monthlyRate,
        monthsInPeriod,
      );
    } else {
      finalBalance +=
        principal *
        (period.annualRate / 100) *
        (monthsInPeriod / 12);
    }
  }

  const interest = finalBalance - principal;

  const inflation = inflationRate / 100;

  const realBalance =
    finalBalance /
    Math.pow(
      1 + inflation,
      months / 12,
    );

  const realProfit = realBalance - principal;

  return {
    principal,
    interest,
    finalBalance,
    realProfit,
  };
}