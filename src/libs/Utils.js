export const currencyFormatter = (number, currency = 'VND') => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  });
  return formatter.format(number);
};
