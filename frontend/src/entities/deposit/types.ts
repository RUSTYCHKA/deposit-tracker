export interface Deposit {
  id: string;
  bankId: string;
  name: string;

  type: "deposit" | "savings-account";

  rate: number;

  minAmount: number;
  maxAmount?: number;

  termMonths?: number;

  capitalization: boolean;
  replenishment: boolean;
  partialWithdrawal: boolean;

  conditions: string[];
}
