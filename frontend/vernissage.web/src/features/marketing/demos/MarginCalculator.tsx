import { useId, useState } from 'react';
import { useMessages } from '../../../i18n/useI18n';
import { formatNumber } from '../../../i18n/format';
import { euro } from './money';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  onChange: (n: number) => void;
}

function Slider({ label, value, min, max, step, format, onChange }: SliderProps) {
  const id = useId();
  return (
    <div className="calc-field">
      <label htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id}>{format(value)}</output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/**
 * What a show leaves the gallery with: sales × commission minus costs. The same
 * figures the private show metrics keep, here to play with.
 */
export default function MarginCalculator() {
  const t = useMessages().galleries.margin;
  const [sold, setSold] = useState(8);
  const [price, setPrice] = useState(2200);
  const [commission, setCommission] = useState(50);
  const [costs, setCosts] = useState(6500);
  const [visitors, setVisitors] = useState(1200);

  const sales = sold * price;
  const income = (sales * commission) / 100;
  const net = income - costs;
  const perVisitor = visitors > 0 ? costs / visitors : 0;

  return (
    <div className="calc">
      <div className="calc-inputs">
        <Slider label={t.sold} value={sold} min={0} max={40} step={1} format={String} onChange={setSold} />
        <Slider label={t.price} value={price} min={200} max={10000} step={100} format={euro} onChange={setPrice} />
        <Slider label={t.commission} value={commission} min={0} max={70} step={5} format={(n) => formatNumber(n / 100, undefined, { style: 'percent' })} onChange={setCommission} />
        <Slider label={t.costs} value={costs} min={0} max={30000} step={250} format={euro} onChange={setCosts} />
        <Slider label={t.visitors} value={visitors} min={0} max={5000} step={50} format={(n) => formatNumber(n)} onChange={setVisitors} />
      </div>
      <div className="calc-result" aria-live="polite">
        <p className="calc-result-label">{t.result}</p>
        <p className={`calc-net${net < 0 ? ' is-loss' : ''}`}>{euro(net)}</p>
        <dl className="calc-breakdown">
          <div>
            <dt>{t.sales}</dt>
            <dd>{euro(sales)}</dd>
          </div>
          <div>
            <dt>{t.yourCommission}</dt>
            <dd>{euro(income)}</dd>
          </div>
          <div>
            <dt>{t.perVisitor}</dt>
            <dd>{formatNumber(perVisitor, undefined, { style: 'currency', currency: 'EUR' })}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
