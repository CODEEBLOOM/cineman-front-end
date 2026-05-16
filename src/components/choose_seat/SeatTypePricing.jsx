import { SEAT_TYPE_PALETTE } from './seatVisualConfig';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

const FALLBACK_PRICES = {
  REGULAR: 45000,
  DOUBLE: 90000,
  VIP: 70000,
};

const seatTypes = [
  { key: 'REGULAR', label: 'Thường' },
  { key: 'DOUBLE', label: 'Đôi' },
  { key: 'VIP', label: 'VIP' },
];

const SeatTypePricing = ({ seatPrices = {} }) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {seatTypes.map(({ key, label }) => {
        const palette = SEAT_TYPE_PALETTE[key];
        const price = seatPrices[key] ?? FALLBACK_PRICES[key];

        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <span
              className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-md border"
              style={{
                backgroundColor: palette.swatch,
                borderColor: palette.swatchBorder,
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-500">
                {label}
              </p>
              <p className="text-[16px] font-extrabold text-slate-900">
                {currencyFormatter.format(price)}đ
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SeatTypePricing;
