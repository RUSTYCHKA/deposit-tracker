import type { Deposit } from '@/entities/deposit';

interface DepositTableProps {
  deposits: Deposit[];
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

export function DepositTable({ deposits }: DepositTableProps) {
  return (
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
          </tr>
        </thead>

        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit.id}>
              <td>
                <strong>{deposit.bank.shortName}</strong>
              </td>

              <td>{deposit.name}</td>

              <td>
                <span className="type-badge">
                  {getTypeLabel(deposit.type)}
                </span>
              </td>

              <td>
                <strong className="rate">
                  {formatRate(deposit.effectiveRate)}
                </strong>

                {deposit.effectiveRate !== deposit.advertisedRate && (
                  <span className="advertised-rate">
                    заявлено {formatRate(deposit.advertisedRate)}
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
                  {formatMoney(deposit.profitFor100k)} ₽
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
                      <span>Без доп. опций</span>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}