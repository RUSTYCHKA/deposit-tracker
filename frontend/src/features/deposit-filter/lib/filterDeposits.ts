import type { Deposit } from '@/entities/deposit';

import type { DepositFilters, DepositSortConfig } from './types';

export function filterDeposits(
  deposits: Deposit[],
  filters: DepositFilters,
): Deposit[] {
  return deposits.filter((deposit) => {
    if (
      filters.type !== 'all' &&
      deposit.type !== filters.type
    ) {
      return false;
    }

    if (
      filters.capitalization &&
      !deposit.capitalization
    ) {
      return false;
    }

    if (
      filters.replenishment &&
      !deposit.replenishment
    ) {
      return false;
    }

    if (
      filters.partialWithdrawal &&
      !deposit.partialWithdrawal
    ) {
      return false;
    }

    if (
      filters.noExtraConditions &&
      hasExtraConditions(deposit)
    ) {
      return false;
    }

    return true;
  });
}

function hasExtraConditions(
  deposit: Deposit,
): boolean {
  const conditions = deposit.conditions;

  return (
    conditions.newCustomer ||
    conditions.cardRequired ||
    conditions.monthlySpendingRequired ||
    conditions.salaryProjectRequired ||
    conditions.subscriptionRequired
  );
}

export function sortDeposits(
  deposits: Deposit[],
  sort: DepositSortConfig,
): Deposit[] {
  return [...deposits].sort((a, b) => {
    const valueA = getSortValue(a, sort.field);
    const valueB = getSortValue(b, sort.field);

    if (valueA === valueB) {
      return 0;
    }

    const result = valueA < valueB ? -1 : 1;

    return sort.direction === 'asc'
      ? result
      : -result;
  });
}

function getSortValue(
  deposit: Deposit,
  field: DepositSortConfig['field'],
): number {
  switch (field) {
    case 'effectiveRate':
      return deposit.effectiveRate;

    case 'realRate':
      return deposit.realRate;

    case 'profit':
      return deposit.profitFor100k;

    case 'minAmount':
      return deposit.minAmount;
  }
}