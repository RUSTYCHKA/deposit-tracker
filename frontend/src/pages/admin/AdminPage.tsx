import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import banksData from "@/shared/data/admin/banks.json";
import inflationData from "@/shared/data/admin/inflation.json";
import productsData from "@/shared/data/admin/products.json";
import ratesData from "@/shared/data/admin/rates.json";

import "./admin.css";

type Bank = (typeof banksData)[number];
type Inflation = (typeof inflationData)[number];
type Product = Omit<(typeof productsData)[number], "maxAmount"> & {
  maxAmount: number | null;
};
type Rate = Omit<(typeof ratesData)[number], "validTo" | "source"> & {
  validTo: string | null;
  source: Omit<(typeof ratesData)[number]["source"], "url"> & {
    url: string | null;
  };
};
type Period = Rate["periods"][number];
type Tab = "banks" | "inflation" | "products" | "rates";

const blankBank: Bank = { id: "", name: "", shortName: "", website: "" };
const blankInflation: Inflation = { date: "", value: 0, source: "manual" };
const blankProduct: Product = {
  id: "",
  bankId: "",
  name: "",
  type: "deposit",
  currency: "RUB",
  minAmount: 0,
  maxAmount: null,
  terms: {
    replenishment: false,
    partialWithdrawal: false,
    capitalization: false,
  },
  operations: { earlyClosureAllowed: true, earlyClosureRate: 0 },
  conditions: {
    newCustomer: false,
    cardRequired: false,
    monthlySpendingRequired: false,
    salaryProjectRequired: false,
    subscriptionRequired: false,
    onlineOpening: true,
  },
  status: "active",
};
const blankRate: Rate = {
  productId: "",
  validFrom: "",
  validTo: null,
  periods: [{ fromMonth: 0, toMonth: 12, annualRate: 0 }],
  source: { type: "manual", url: null, checkedAt: "" },
};
const conditionLabels: Record<string, string> = {
  newCustomer: "Только новым клиентам",
  cardRequired: "Нужна карта",
  monthlySpendingRequired: "Нужны траты по карте",
  salaryProjectRequired: "Зарплатный проект",
  subscriptionRequired: "Нужна подписка",
  onlineOpening: "Открытие онлайн",
};

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="check-label">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

export function AdminPage() {
  const [tab, setTab] = useState<Tab>("products");
  const [banks, setBanks] = useState<Bank[]>(banksData);
  const [inflation, setInflation] = useState<Inflation[]>(inflationData);
  const [products, setProducts] = useState<Product[]>(productsData);
  const [rates, setRates] = useState<Rate[]>(ratesData);
  const [message, setMessage] = useState("");

  function save(filename: string, value: unknown) {
    downloadJson(filename, value);
    setMessage(`${filename} скачан. Замените им исходный файл в папке data.`);
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <Link to="/" className="back-link">
            ← К сравнению
          </Link>
          <p className="eyebrow">DEPOSIT TRACKER / ADMIN</p>
          <h1>Исходные данные</h1>
          <p>
            Заполняйте справочники, затем скачайте изменённые JSON-файлы.
            Расчётные данные здесь не редактируются.
          </p>
        </div>
        {message && <div className="admin-message">{message}</div>}
      </header>
      <nav className="data-tabs" aria-label="Разделы данных">
        {(
          [
            ["products", "Продукты", products.length],
            ["rates", "Ставки", rates.length],
            ["banks", "Банки", banks.length],
            ["inflation", "Инфляция", inflation.length],
          ] as const
        ).map(([value, label, count]) => (
          <button
            key={value}
            className={tab === value ? "active" : ""}
            onClick={() => {
              setTab(value);
              setMessage("");
            }}
          >
            {label}
            <span>{count}</span>
          </button>
        ))}
      </nav>
      {tab === "banks" && (
        <BanksEditor
          items={banks}
          setItems={setBanks}
          onSave={() => save("banks.json", banks)}
        />
      )}
      {tab === "inflation" && (
        <InflationEditor
          items={inflation}
          setItems={setInflation}
          onSave={() => save("inflation.json", inflation)}
        />
      )}
      {tab === "products" && (
        <ProductsEditor
          items={products}
          setItems={setProducts}
          onSave={() => save("products.json", products)}
        />
      )}
      {tab === "rates" && (
        <RatesEditor
          items={rates}
          setItems={setRates}
          onSave={() => save("rates.json", rates)}
        />
      )}
    </main>
  );
}

function BanksEditor({
  items,
  setItems,
  onSave,
}: {
  items: Bank[];
  setItems: (value: Bank[]) => void;
  onSave: () => void;
}) {
  const update = (index: number, key: keyof Bank, value: string) =>
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  return (
    <Editor
      title="Банки"
      hint="Справочник банков, на который ссылаются продукты."
      onSave={onSave}
      onAdd={() => setItems([...items, { ...blankBank }])}
    >
      {items.map((item, index) => (
        <article className="data-card" key={`bank-${index}`}>
          <div className="card-title">
            <strong>{item.name || "Новый банк"}</strong>
            <button
              type="button"
              className="delete-button"
              onClick={() =>
                setItems(items.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Удалить
            </button>
          </div>
          <div className="form-grid">
            <Field
              label="ID"
              value={item.id}
              onChange={(value) => update(index, "id", value)}
            />
            <Field
              label="Название"
              value={item.name}
              onChange={(value) => update(index, "name", value)}
            />
            <Field
              label="Короткое название"
              value={item.shortName}
              onChange={(value) => update(index, "shortName", value)}
            />
            <Field
              label="Сайт"
              type="url"
              value={item.website}
              onChange={(value) => update(index, "website", value)}
            />
          </div>
        </article>
      ))}
    </Editor>
  );
}

function InflationEditor({
  items,
  setItems,
  onSave,
}: {
  items: Inflation[];
  setItems: (value: Inflation[]) => void;
  onSave: () => void;
}) {
  const update = (
    index: number,
    key: keyof Inflation,
    value: string | number,
  ) =>
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  return (
    <Editor
      title="Инфляция"
      hint="Последняя запись используется генератором как текущая инфляция."
      onSave={onSave}
      onAdd={() => setItems([...items, { ...blankInflation }])}
    >
      {items.map((item, index) => (
        <article className="data-card" key={`inflation-${index}`}>
          <div className="card-title">
            <strong>{item.date || "Новая запись"}</strong>
            <button
              type="button"
              className="delete-button"
              onClick={() =>
                setItems(items.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Удалить
            </button>
          </div>
          <div className="form-grid">
            <Field
              label="Месяц (YYYY-MM)"
              value={item.date}
              onChange={(value) => update(index, "date", value)}
            />
            <NumberField
              label="Инфляция, %"
              value={item.value}
              onChange={(value) => update(index, "value", value)}
            />
            <Field
              label="Источник"
              value={item.source}
              onChange={(value) => update(index, "source", value)}
            />
          </div>
        </article>
      ))}
    </Editor>
  );
}

function ProductsEditor({
  items,
  setItems,
  onSave,
}: {
  items: Product[];
  setItems: (value: Product[]) => void;
  onSave: () => void;
}) {
  const update = (index: number, patch: Partial<Product>) =>
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  const updateNested = (
    index: number,
    key: "terms" | "operations" | "conditions",
    name: string,
    value: boolean | number,
  ) =>
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [key]: { ...item[key], [name]: value } }
          : item,
      ),
    );
  return (
    <Editor
      title="Продукты"
      hint="Здесь только исходные параметры продукта. Доходность рассчитывает generate_data.py."
      onSave={onSave}
      onAdd={() => setItems([...items, structuredClone(blankProduct)])}
    >
      {items.map((item, index) => (
        <article className="data-card" key={`product-${index}`}>
          <div className="card-title">
            <strong>{item.name || "Новый продукт"}</strong>
            <button
              type="button"
              className="delete-button"
              onClick={() =>
                setItems(items.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Удалить
            </button>
          </div>
          <div className="form-grid">
            <Field
              label="ID"
              value={item.id}
              onChange={(value) => update(index, { id: value })}
            />
            <Field
              label="ID банка"
              value={item.bankId}
              onChange={(value) => update(index, { bankId: value })}
            />
            <Field
              label="Название"
              value={item.name}
              onChange={(value) => update(index, { name: value })}
            />
            <SelectField
              label="Тип"
              value={item.type}
              options={["deposit", "savings-account"]}
              onChange={(value) =>
                update(index, { type: value as Product["type"] })
              }
            />
            <Field
              label="Валюта"
              value={item.currency}
              onChange={(value) => update(index, { currency: value })}
            />
            <NumberField
              label="Минимальная сумма"
              value={item.minAmount}
              onChange={(value) => update(index, { minAmount: value })}
            />
            <NumberField
              label="Максимальная сумма"
              value={item.maxAmount ?? ""}
              onChange={(value) => update(index, { maxAmount: value || null })}
            />
            <SelectField
              label="Статус"
              value={item.status}
              options={["active", "inactive"]}
              onChange={(value) =>
                update(index, { status: value as Product["status"] })
              }
            />
          </div>
          <h3>Опции</h3>
          <div className="check-grid">
            <Toggle
              label="Пополнение"
              checked={item.terms.replenishment}
              onChange={(value) =>
                updateNested(index, "terms", "replenishment", value)
              }
            />
            <Toggle
              label="Частичное снятие"
              checked={item.terms.partialWithdrawal}
              onChange={(value) =>
                updateNested(index, "terms", "partialWithdrawal", value)
              }
            />
            <Toggle
              label="Капитализация"
              checked={item.terms.capitalization}
              onChange={(value) =>
                updateNested(index, "terms", "capitalization", value)
              }
            />
            <Toggle
              label="Досрочное закрытие"
              checked={item.operations.earlyClosureAllowed}
              onChange={(value) =>
                updateNested(index, "operations", "earlyClosureAllowed", value)
              }
            />
            <NumberField
              label="Ставка при досрочном закрытии"
              value={item.operations.earlyClosureRate}
              onChange={(value) =>
                updateNested(index, "operations", "earlyClosureRate", value)
              }
            />
          </div>
          <h3>Условия</h3>
          <div className="check-grid">
            {Object.entries(item.conditions).map(([key, value]) => (
              <Toggle
                key={key}
                label={conditionLabels[key] ?? key}
                checked={value}
                onChange={(nextValue) =>
                  updateNested(index, "conditions", key, nextValue)
                }
              />
            ))}
          </div>
        </article>
      ))}
    </Editor>
  );
}

function RatesEditor({
  items,
  setItems,
  onSave,
}: {
  items: Rate[];
  setItems: (value: Rate[]) => void;
  onSave: () => void;
}) {
  const update = (index: number, patch: Partial<Rate>) =>
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  const updatePeriod = (
    rateIndex: number,
    periodIndex: number,
    key: keyof Period,
    value: number,
  ) =>
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === rateIndex
          ? {
              ...item,
              periods: item.periods.map((period, index) =>
                index === periodIndex ? { ...period, [key]: value } : period,
              ),
            }
          : item,
      ),
    );
  return (
    <Editor
      title="Ставки"
      hint="Периоды ставок принадлежат продукту и хранятся в rates.json."
      onSave={onSave}
      onAdd={() => setItems([...items, structuredClone(blankRate)])}
    >
      {items.map((item, index) => (
        <article className="data-card" key={`rate-${index}`}>
          <div className="card-title">
            <strong>{item.productId || "Новая ставка"}</strong>
            <button
              type="button"
              className="delete-button"
              onClick={() =>
                setItems(items.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Удалить
            </button>
          </div>
          <div className="form-grid">
            <Field
              label="ID продукта"
              value={item.productId}
              onChange={(value) => update(index, { productId: value })}
            />
            <Field
              label="Действует с"
              type="date"
              value={item.validFrom}
              onChange={(value) => update(index, { validFrom: value })}
            />
            <Field
              label="Действует по"
              type="date"
              value={item.validTo ?? ""}
              onChange={(value) => update(index, { validTo: value || null })}
            />
            <Field
              label="Тип источника"
              value={item.source.type}
              onChange={(value) =>
                update(index, { source: { ...item.source, type: value } })
              }
            />
            <Field
              label="URL источника"
              type="url"
              value={item.source.url ?? ""}
              onChange={(value) =>
                update(index, {
                  source: { ...item.source, url: value || null },
                })
              }
            />
            <Field
              label="Проверено"
              type="date"
              value={item.source.checkedAt}
              onChange={(value) =>
                update(index, { source: { ...item.source, checkedAt: value } })
              }
            />
          </div>
          <h3>Периоды</h3>
          <div className="rate-periods">
            {item.periods.map((period, periodIndex) => (
              <div className="rate-period" key={`period-${periodIndex}`}>
                <NumberField
                  label="С месяца"
                  value={period.fromMonth}
                  onChange={(value) =>
                    updatePeriod(index, periodIndex, "fromMonth", value)
                  }
                />
                <NumberField
                  label="По месяц"
                  value={period.toMonth}
                  onChange={(value) =>
                    updatePeriod(index, periodIndex, "toMonth", value)
                  }
                />
                <NumberField
                  label="Ставка, %"
                  value={period.annualRate}
                  onChange={(value) =>
                    updatePeriod(index, periodIndex, "annualRate", value)
                  }
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    update(index, {
                      periods: item.periods.filter(
                        (_, valueIndex) => valueIndex !== periodIndex,
                      ),
                    })
                  }
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-period-button"
            onClick={() =>
              update(index, {
                periods: [
                  ...item.periods,
                  {
                    fromMonth: item.periods.at(-1)?.toMonth ?? 0,
                    toMonth: 12,
                    annualRate: 0,
                  },
                ],
              })
            }
          >
            + Добавить период
          </button>
        </article>
      ))}
    </Editor>
  );
}

function Editor({
  title,
  hint,
  onAdd,
  onSave,
  children,
}: {
  title: string;
  hint: string;
  onAdd: () => void;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="panel-kicker">Редактор</span>
          <h2>{title}</h2>
          <p>{hint}</p>
        </div>
        <div className="editor-actions">
          <button type="button" className="secondary-button" onClick={onAdd}>
            + Добавить
          </button>
          <button type="button" className="primary-button" onClick={onSave}>
            Скачать {title}.json
          </button>
        </div>
      </div>
      <div className="data-list">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      {label}
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
