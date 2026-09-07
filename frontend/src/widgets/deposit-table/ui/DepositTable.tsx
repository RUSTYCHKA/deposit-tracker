import { Link } from 'react-router-dom';

import type { Deposit } from '@/entities/deposit';

interface DepositTableProps {
  deposits: Deposit[];
  selectedDepositId?: string;
  onSelectDeposit: (deposit: Deposit) => void;
}

function formatRate(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value);
}

function getTypeLabel(type: Deposit['type']): string {
  return type === 'deposit'
    ? 'Вклад'
    : 'Накопительный счёт';
}

export function DepositTable({
  deposits,
  selectedDepositId,
  onSelectDeposit,
}: DepositTableProps) {
  return (
    <>
      <div className="deposit-table-wrapper">
        <table className="deposit-table">
          <thead>
            <tr>
              <th>Банк</th>
              <th>Продукт</th>
              <th>Тип</th>
              <th>Ставка</th>
              <th>Реальная доходность</th>
              <th>Доход с 100 000 ₽</th>
              <th>Условия</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {deposits.map((deposit) => (
              <tr
                key={deposit.id}
                className={
                  selectedDepositId === deposit.id
                    ? 'selected'
                    : ''
                }
              >
                <td>
                  <strong>{deposit.bank.shortName}</strong>
                </td>

                <td>
                  <Link
                    to={`/deposit/${deposit.id}`}
                    className="deposit-link"
                  >
                    {deposit.name}
                  </Link>
                </td>

                <td>
                  <span className="type-badge">
                    {getTypeLabel(deposit.type)}
                  </span>
                </td>

                <td>
                  <strong className="rate">
                    {formatRate(deposit.effectiveRate)}
                  </strong>

                  {deposit.effectiveRate !==
                    deposit.advertisedRate && (
                    <span className="advertised-rate">
                      заявлено{' '}
                      {formatRate(
                        deposit.advertisedRate,
                      )}
                    </span>
                  )}
                </td>

                <td>
                  <strong>
                    {formatRate(deposit.realRate)}
                  </strong>
                </td>

                <td>
                  <strong>
                    {formatMoney(
                      deposit.profitFor100k,
                    )}{' '}
                    ₽
                  </strong>
                </td>

                <td>
                  <div className="conditions">
                    {deposit.capitalization && (
                      <span>Капитализация</span>
                    )}

                    {deposit.replenishment && (
                      <span>Пополнение</span>
                    )}

                    {deposit.partialWithdrawal && (
                      <span>Снятие</span>
                    )}

                    {!deposit.capitalization &&
                      !deposit.replenishment &&
                      !deposit.partialWithdrawal && (
                        <span>
                          Без доп. опций
                        </span>
                      )}
                  </div>
                </td>

                <td>
                  <button
                    className="calculate-button"
                    onClick={() =>
                      onSelectDeposit(deposit)
                    }
                  >
                    {selectedDepositId === deposit.id
                      ? 'Выбран'
                      : 'Рассчитать'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="deposit-cards">
        {deposits.map((deposit) => (
          <article
            className={
              selectedDepositId === deposit.id
                ? 'deposit-card selected'
                : 'deposit-card'
            }
            key={deposit.id}
          >
            <div className="deposit-card-header">
              <div>
                <span className="deposit-card-bank">
                  {deposit.bank.shortName}
                </span>

                <Link
                  to={`/deposit/${deposit.id}`}
                  className="deposit-card-title"
                >
                  {deposit.name}
                </Link>
              </div>

              <span className="type-badge">
                {getTypeLabel(deposit.type)}
              </span>
            </div>

            <div className="deposit-card-rate">
              <span>Эффективная ставка</span>

              <strong>
                {formatRate(deposit.effectiveRate)}
              </strong>
            </div>

            <div className="deposit-card-stats">
              <div>
                <span>Реальная доходность</span>

                <strong>
                  {formatRate(deposit.realRate)}
                </strong>
              </div>

              <div>
                <span>Доход с 100 000 ₽</span>

                <strong>
                  +{formatMoney(
                    deposit.profitFor100k,
                  )}{' '}
                  ₽
                </strong>
              </div>
            </div>

            <div className="deposit-card-conditions">
              {deposit.capitalization && (
                <span>Капитализация</span>
              )}

              {deposit.replenishment && (
                <span>Пополнение</span>
              )}

              {deposit.partialWithdrawal && (
                <span>Снятие</span>
              )}

              {!deposit.capitalization &&
                !deposit.replenishment &&
                !deposit.partialWithdrawal && (
                  <span>Без доп. опций</span>
                )}
            </div>

            <div className="deposit-card-footer">
              <Link
                to={`/deposit/${deposit.id}`}
                className="deposit-card-details"
              >
                Подробнее →
              </Link>

              <button
                className="calculate-button"
                onClick={() =>
                  onSelectDeposit(deposit)
                }
              >
                {selectedDepositId === deposit.id
                  ? 'Выбран'
                  : 'Рассчитать'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}