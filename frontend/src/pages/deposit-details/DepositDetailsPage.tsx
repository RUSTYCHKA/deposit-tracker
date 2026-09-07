import { Link, useParams } from 'react-router-dom';

import {
  getDeposits,
  getInflationRate,
} from '@/entities/deposit/lib/getDeposits';

import { DepositDetailsCalculator } from '@/widgets/deposit-details-calculator';

function formatMoney(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value);
}

function getTypeLabel(type: 'deposit' | 'savings-account'): string {
  return type === 'deposit'
    ? 'Вклад'
    : 'Накопительный счёт';
}

export function DepositDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const deposits = getDeposits();
  const inflationRate = getInflationRate();

  const deposit = deposits.find(
    (item) => item.id === id,
  );

  if (!deposit) {
    return (
      <main className="page">
        <Link to="/">← Назад к продуктам</Link>

        <div className="empty-state">
          <strong>Продукт не найден</strong>

          <p>
            Возможно, продукт был удалён или его
            идентификатор изменился.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <Link
        to="/"
        className="back-link"
      >
        ← Все продукты
      </Link>

      <section className="deposit-details">
        <div className="deposit-details-header">
          <div>
            <span className="eyebrow">
              {getTypeLabel(deposit.type)}
            </span>

            <h1>{deposit.name}</h1>

            <p className="deposit-bank">
              {deposit.bank.name}
            </p>
          </div>

          <div className="deposit-main-rate">
            <span>Эффективная ставка</span>

            <strong>
              {deposit.effectiveRate.toFixed(2)}%
            </strong>
          </div>
        </div>

        <div className="deposit-metrics">
          <div>
            <span>Заявленная ставка</span>

            <strong>
              {deposit.advertisedRate.toFixed(2)}%
            </strong>
          </div>

          <div>
            <span>Реальная доходность</span>

            <strong>
              {deposit.realRate.toFixed(2)}%
            </strong>
          </div>

          <div>
            <span>Срок</span>

            <strong>
              {deposit.termMonths} мес.
            </strong>
          </div>

          <div>
            <span>Минимальная сумма</span>

            <strong>
              {deposit.minAmount === 0
                ? 'Без минимума'
                : `${formatMoney(deposit.minAmount)} ₽`}
            </strong>
          </div>
        </div>

        <div className="deposit-details-grid">
          <section className="details-card">
            <h2>Условия</h2>

            <div className="details-list">
              <div>
                <span>Капитализация</span>

                <strong>
                  {deposit.capitalization
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>

              <div>
                <span>Пополнение</span>

                <strong>
                  {deposit.replenishment
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>

              <div>
                <span>Частичное снятие</span>

                <strong>
                  {deposit.partialWithdrawal
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>

              <div>
                <span>Онлайн-открытие</span>

                <strong>
                  {deposit.conditions.onlineOpening
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>
            </div>
          </section>

          <section className="details-card">
            <h2>Дополнительные условия</h2>

            <div className="details-list">
              <div>
                <span>Только новым клиентам</span>

                <strong>
                  {deposit.conditions.newCustomer
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>

              <div>
                <span>Требуется карта</span>

                <strong>
                  {deposit.conditions.cardRequired
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>

              <div>
                <span>Требуются траты в месяц</span>

                <strong>
                  {deposit.conditions
                    .monthlySpendingRequired
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>

              <div>
                <span>Требуется зарплатный проект</span>

                <strong>
                  {deposit.conditions
                    .salaryProjectRequired
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>

              <div>
                <span>Требуется подписка</span>

                <strong>
                  {deposit.conditions
                    .subscriptionRequired
                    ? 'Да'
                    : 'Нет'}
                </strong>
              </div>
            </div>
          </section>
        </div>

        <section className="details-card rate-periods">
          <h2>Из чего складывается доходность</h2>

          <p className="details-description">
            Ставка может изменяться в течение срока
            размещения. Поэтому итоговая доходность
            рассчитывается по каждому периоду отдельно.
          </p>

          <div className="rate-period-list">
            {deposit.ratePeriods.map((period) => (
              <div
                className="rate-period"
                key={`${period.fromMonth}-${period.toMonth}`}
              >
                <span>
                  {period.fromMonth + 1}–{period.toMonth}{' '}
                  месяц
                </span>

                <strong>
                  {period.annualRate.toFixed(2)}%
                </strong>
              </div>
            ))}
          </div>
        </section>
        
        <DepositDetailsCalculator
            deposit={deposit}
            inflationRate={inflationRate}
        />

        <p className="data-source">
          Данные актуальны на{' '}
          {new Date(
            deposit.rateValidFrom,
          ).toLocaleDateString('ru-RU')}
        </p>
      </section>
    </main>
  );
}