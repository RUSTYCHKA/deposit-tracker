import { useMemo} from 'react';

import type { Deposit } from '@/entities/deposit';

import { calculateProfit } from '../lib/calculateProfit';

interface DepositCalculatorProps {
  deposit: Deposit;
  inflationRate: number;
  amount: string;
  onAmountChange: (amount: string) => void;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function DepositCalculator({
  deposit,
  inflationRate,
    amount,
    onAmountChange,
}: DepositCalculatorProps) {
  

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
    <div className="deposit-calculator">
      <div className="deposit-calculator-header">
        <div>
          <span className="calculator-label">
            Калькулятор
          </span>

          <h3>{deposit.name}</h3>

          <p>{deposit.bank.shortName}</p>
        </div>

        <div className="calculator-rate">
          <span>Доходность</span>
          <strong>
            {deposit.effectiveRate.toFixed(2)}%
          </strong>
        </div>
      </div>

      <div className="calculator-field">
        <label htmlFor={`deposit-amount-${deposit.id}`}>
          Сумма
        </label>

        <div className="calculator-input">
          <input
            id={`deposit-amount-${deposit.id}`}
            type="number"
            min="0"
            value={amount}
            onChange={(event) =>
              onAmountChange(event.target.value)
            }
          />

          <span>₽</span>
        </div>
      </div>

      <div className="calculator-results">
        <div className="result">
          <span>Срок</span>
          <strong>
            {deposit.termMonths} мес.
          </strong>
        </div>

        <div className="result">
          <span>Доход</span>
          <strong>
            +{formatMoney(calculation.interest)} ₽
          </strong>
        </div>

        <div className="result result-main">
          <span>Итоговая сумма</span>
          <strong>
            {formatMoney(calculation.finalBalance)} ₽
          </strong>
        </div>

        <div className="result">
          <span>С учётом инфляции</span>
          <strong>
            {formatMoney(calculation.realProfit)} ₽
          </strong>
        </div>
      </div>
    </div>
  );
}