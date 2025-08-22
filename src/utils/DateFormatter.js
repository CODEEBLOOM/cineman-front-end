export default class DateFormatter {
  constructor(date = new Date()) {
    this.date = new Date(date);
  }

  format = (pattern) => {
    const pad = (n) => String(n).padStart(2, '0');

    const { date: d } = this;

    const map = {
      YYYY: d.getFullYear(),
      YY: String(d.getFullYear()).slice(-2),
      MM: pad(d.getMonth() + 1),
      M: d.getMonth() + 1,
      DD: pad(d.getDate()),
      D: d.getDate(),
      HH: pad(d.getHours()),
      mm: pad(d.getMinutes()),
      ss: pad(d.getSeconds()),
    };

    return Object.entries(map).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(key, 'g'), value),
      pattern
    );
  };
}
