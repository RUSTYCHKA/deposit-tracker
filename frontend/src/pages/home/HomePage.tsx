import { useMemo, useState } from 'react';

import { getDeposits, getInflationRate } from '@/entities/deposit/lib/getDeposits';
import { DepositTable } from '@/widgets/deposit-table';

type FilterType = 'all' | 'deposit' | 'savings-account';

export function HomePage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [amount, setAmount] = useState(100000);

  const deposits = getDeposits();
  const inflationRate = getInflationRate();

  const filteredDeposits = useMemo(() => {
    if (filter === 'all') {
      return deposits;
    }

    return deposits.filter(
      (deposit) => deposit.type === filter,
    );
  }, [deposits, filter]);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">DEPOSIT TRACKER</p>

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
          <strong>{inflationRate.toFixed(1)}%</strong>
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
                setAmount(Number(event.target.value))
              }
            />

            <span>₽</span>
          </div>
        </div>

        <div className="calculator-info">
          Показываем доходность для суммы{' '}
          <strong>
            {new Intl.NumberFormat('ru-RU').format(amount)} ₽
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

          <div className="filters">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Все
            </button>

            <button
              className={filter === 'deposit' ? 'active' : ''}
              onClick={() => setFilter('deposit')}
            >
              Вклады
            </button>

            <button
              className={
                filter === 'savings-account' ? 'active' : ''
              }
              onClick={() => setFilter('savings-account')}
            >
              Накопительные счета
            </button>
          </div>
        </div>

        <DepositTable deposits={filteredDeposits} />
      </section>
    </main>
  );
}