export interface DepositConditions {
  newCustomer: boolean;
  cardRequired: boolean;
  monthlySpendingRequired: boolean;
  salaryProjectRequired: boolean;
  subscriptionRequired: boolean;
  onlineOpening: boolean;
}

export interface DepositBank {
  id: string;
  name: string;
  shortName: string;
  website: string;
}

export interface Deposit {
  id: string;

  bank: DepositBank;

  name: string;

  type: 'deposit' | 'savings-account';

  currency: string;

  minAmount: number;
  maxAmount: number | null;

  termMonths: number;

  advertisedRate: number;
  effectiveRate: number;
  realRate: number;

  profitFor100k: number;

  capitalization: boolean;
  replenishment: boolean;
  partialWithdrawal: boolean;

  conditions: DepositConditions;

  status: 'active' | 'inactive';

  rateValidFrom: string;
}