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

  const annualRate = deposit.effectiveRate / 100;
  const inflation = inflationRate / 100;

  let finalBalance: number;

  if (deposit.capitalization) {
    const monthlyRate = annualRate / 12;

    finalBalance =
      principal * Math.pow(1 + monthlyRate, months);
  } else {
    finalBalance =
      principal * (1 + annualRate * (months / 12));
  }

  const interest = finalBalance - principal;

  const realBalance =
    finalBalance /
    Math.pow(1 + inflation, months / 12);

  const realProfit = realBalance - principal;

  return {
    principal,
    interest,
    finalBalance,
    realProfit,
  };
}