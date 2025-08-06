export const currencyFormatter = (number, currency = 'VND') => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  });
  return formatter.format(number);
};

export const formatNumber = (
  number,
  options = {
    locale: 'vi-VN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
) => {
  if (typeof number !== 'number' || isNaN(number)) return '';

  const formatter = new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
  });

  return formatter.format(number);
};
