import { useMemo, useState } from 'react';

import type { Deposit } from '@/entities/deposit';

import { calculateProfit } from '@/features/deposit-calculator/lib/calculateProfit';

interface DepositDetailsCalculatorProps {
  deposit: Deposit;
  inflationRate: number;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function DepositDetailsCalculator({
  deposit,
  inflationRate,
}: DepositDetailsCalculatorProps) {
  const [amount, setAmount] = useState('100000');

  const calculation = useMemo(
    () =>
      calculateProfit(
        deposit,
        Number(amount) || 0,
        inflationRate,
      ),
    [deposit, amount, inflationRate],
  );

  return (
    <section className="details-card details-calculator">
      <div className="details-calculator-header">
        <div>
          <span className="calculator-label">
            Калькулятор
          </span>

          <h2>Рассчитайте свой доход</h2>

          <p>
            Расчёт учитывает периоды ставок и
            капитализацию.
          </p>
        </div>
      </div>

      <div className="details-calculator-input">
        <label htmlFor="details-amount">
          Сумма размещения
        </label>

        <div className="calculator-input">
          <input
            id="details-amount"
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

      <div className="details-calculator-results">
        <div>
          <span>Сумма</span>

          <strong>
            {formatMoney(
              Number(amount) || 0,
            )}{' '}
            ₽
          </strong>
        </div>

        <div>
          <span>Доход</span>

          <strong>
            +{formatMoney(calculation.interest)} ₽
          </strong>
        </div>

        <div>
          <span>Итоговая сумма</span>

          <strong>
            {formatMoney(
              calculation.finalBalance,
            )}{' '}
            ₽
          </strong>
        </div>

        <div>
          <span>Реальная прибыль</span>

          <strong>
            {formatMoney(
              calculation.realProfit,
            )}{' '}
            ₽
          </strong>
        </div>
      </div>
    </section>
  );
}