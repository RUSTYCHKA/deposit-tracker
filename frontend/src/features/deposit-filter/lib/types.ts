import type { Deposit } from '@/entities/deposit';

export type DepositType = 'all' | Deposit['type'];

export type DepositSort =
  | 'effectiveRate'
  | 'realRate'
  | 'profit'
  | 'minAmount';

export interface DepositFilters {
  type: DepositType;
  capitalization: boolean;
  replenishment: boolean;
  partialWithdrawal: boolean;
  noExtraConditions: boolean;
}

export interface DepositSortConfig {
  field: DepositSort;
  direction: 'asc' | 'desc';
}