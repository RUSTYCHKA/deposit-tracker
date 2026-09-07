import type {
  DepositFilters as DepositFiltersState,
  DepositSortConfig,
} from '../lib/types';

interface DepositFiltersProps {
  filters: DepositFiltersState;
  sort: DepositSortConfig;
  onFiltersChange: (
    filters: DepositFiltersState,
  ) => void;
  onSortChange: (
    sort: DepositSortConfig,
  ) => void;
}

export function DepositFilters({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
}: DepositFiltersProps) {
  function toggle(
    field: keyof Omit<DepositFiltersState, 'type'>,
  ) {
    onFiltersChange({
      ...filters,
      [field]: !filters[field],
    });
  }

  return (
    <div className="deposit-filters">
      <div className="filter-group">
        <span className="filter-title">
          Тип продукта
        </span>

        <div className="filter-buttons">
          <button
            className={
              filters.type === 'all'
                ? 'active'
                : ''
            }
            onClick={() =>
              onFiltersChange({
                ...filters,
                type: 'all',
              })
            }
          >
            Все
          </button>

          <button
            className={
              filters.type === 'deposit'
                ? 'active'
                : ''
            }
            onClick={() =>
              onFiltersChange({
                ...filters,
                type: 'deposit',
              })
            }
          >
            Вклады
          </button>

          <button
            className={
              filters.type === 'savings-account'
                ? 'active'
                : ''
            }
            onClick={() =>
              onFiltersChange({
                ...filters,
                type: 'savings-account',
              })
            }
          >
            Накопительные счета
          </button>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-title">
          Возможности
        </span>

        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={filters.capitalization}
              onChange={() =>
                toggle('capitalization')
              }
            />
            Капитализация
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.replenishment}
              onChange={() =>
                toggle('replenishment')
              }
            />
            Пополнение
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.partialWithdrawal}
              onChange={() =>
                toggle('partialWithdrawal')
              }
            />
            Частичное снятие
          </label>

          <label>
            <input
              type="checkbox"
              checked={filters.noExtraConditions}
              onChange={() =>
                toggle('noExtraConditions')
              }
            />
            Без доп. условий
          </label>
        </div>
      </div>

      <div className="filter-group sort-group">
        <span className="filter-title">
          Сортировка
        </span>

        <select
          value={sort.field}
          onChange={(event) =>
            onSortChange({
              ...sort,
              field: event.target.value as DepositSortConfig['field'],
            })
          }
        >
          <option value="effectiveRate">
            Эффективная ставка
          </option>

          <option value="realRate">
            Реальная доходность
          </option>

          <option value="profit">
            Доход
          </option>

          <option value="minAmount">
            Минимальная сумма
          </option>
        </select>

        <button
          className="sort-direction"
          onClick={() =>
            onSortChange({
              ...sort,
              direction:
                sort.direction === 'desc'
                  ? 'asc'
                  : 'desc',
            })
          }
        >
          {sort.direction === 'desc'
            ? '↓'
            : '↑'}
        </button>
      </div>
    </div>
  );
}