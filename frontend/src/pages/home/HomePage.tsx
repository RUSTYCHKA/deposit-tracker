import { useMemo, useState } from 'react';

import type { Deposit } from '@/entities/deposit';
import {
  DepositFilters,
  filterDeposits,
  sortDeposits,
  type DepositFiltersState,
  type DepositSortConfig,
} from '@/features/deposit-filter';

import {
  getDeposits,
  getInflationRate,
} from '@/entities/deposit/lib/getDeposits';

import { DepositCalculator } from '@/features/deposit-calculator';
import { DepositTable } from '@/widgets/deposit-table';

const initialFilters: DepositFiltersState = {
  type: 'all',
  capitalization: false,
  replenishment: false,
  partialWithdrawal: false,
  noExtraConditions: false,
};

const initialSort: DepositSortConfig = {
  field: 'effectiveRate',
  direction: 'desc',
};

export function HomePage() {
  const [filters, setFilters] =
    useState<DepositFiltersState>(
      initialFilters,
    );

  const [sort, setSort] =
    useState<DepositSortConfig>(
      initialSort,
    );

  const [amount, setAmount] = useState(
    '100000',
  );

  const deposits = getDeposits();
  const inflationRate = getInflationRate();

  const filteredDeposits = useMemo(() => {
    const filtered = filterDeposits(
      deposits,
      filters,
    );

    return sortDeposits(filtered, sort);
  }, [deposits, filters, sort]);

  const selectedDeposit: Deposit | undefined =
    filteredDeposits[0];

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">
            DEPOSIT TRACKER
          </p>

          <h1>
            Сравнивай вклады
            <br />
            по реальной доходности
          </h1>

          <p className="hero-description">
            Смотрим не только на рекламную ставку,
            но и на фактический доход, условия
            и влияние инфляции.
          </p>
        </div>

        <div className="hero-stat">
          <span>Текущая инфляция</span>

          <strong>
            {inflationRate.toFixed(1)}%
          </strong>
        </div>
      </section>

      <section className="calculator">
        <div>
          <label htmlFor="amount">
            Сумма размещения
          </label>

          <div className="amount-input">
            <input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
            />

            <span>₽</span>
          </div>
        </div>

        <div className="calculator-info">
          Рассчитываем доходность для суммы{' '}
          <strong>
            {amount
              ? new Intl.NumberFormat(
                  'ru-RU',
                ).format(Number(amount))
              : '0'}{' '}
            ₽
          </strong>
        </div>
      </section>

      <section className="products">
        <div className="section-header">
          <div>
            <h2>Финансовые продукты</h2>

            <p>
              Найдено: {filteredDeposits.length}
            </p>
          </div>
        </div>

        <DepositFilters
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
        />

        {filteredDeposits.length > 0 ? (
          <DepositTable
            deposits={filteredDeposits}
          />
        ) : (
          <div className="empty-state">
            <strong>
              Ничего не найдено
            </strong>

            <p>
              Попробуйте изменить параметры
              фильтрации.
            </p>
          </div>
        )}
      </section>

      {selectedDeposit && (
        <DepositCalculator
          deposit={selectedDeposit}
          inflationRate={inflationRate}
        />
      )}
    </main>
  );
}