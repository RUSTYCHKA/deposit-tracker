import type { Deposit } from '../types';

import data from '@/shared/data/deposits.json';

interface DepositsData {
  generatedAt: string;
  inflationRate: number;
  products: Deposit[];
}

const depositsData = data as DepositsData;

export function getDeposits(): Deposit[] {
  return depositsData.products;
}

export function getInflationRate(): number {
  return depositsData.inflationRate;
}

export function getGeneratedAt(): string {
  return depositsData.generatedAt;
}