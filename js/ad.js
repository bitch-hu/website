// When to show the ad. All dates/times are the browser's local time.

const AD_COOKIE_NAME = 'adShownOn';
const AD_CHANCE = 1 / 36;
const AD_FROM_HOUR = 9;
const AD_UNTIL_HOUR = 17;
const AD_URL = "/cocks/";
// Rarely the ad leads elsewhere; null is off
const AD_ALTERNATIVE_URL = "https://www.google.com/search?q=huge+cocks&udm=2&safe=off";
const AD_ALTERNATIVE_CHANCE = 1 / 36;

// [year, month, day] of the first day; dates may differ by a day depending on the country.
// Extend these tables before 2036.
const EID_AL_FITR = [
  [2026, 3, 20], [2027, 3, 9], [2028, 2, 26], [2029, 2, 14], [2030, 2, 4],
  [2031, 1, 24], [2032, 1, 14], [2033, 1, 2], [2033, 12, 23], [2034, 12, 12], [2035, 12, 1]
];
const EID_AL_ADHA = [
  [2026, 5, 27], [2027, 5, 16], [2028, 5, 5], [2029, 4, 24], [2030, 4, 13],
  [2031, 4, 2], [2032, 3, 22], [2033, 3, 11], [2034, 3, 1], [2035, 2, 18]
];
// Yom Kippur is always 9 days after, Passover (first day) 163 days before Rosh Hashanah.
const ROSH_HASHANAH = [
  [2026, 9, 12], [2027, 10, 2], [2028, 9, 21], [2029, 9, 10], [2030, 9, 28],
  [2031, 9, 18], [2032, 9, 6], [2033, 9, 24], [2034, 9, 14], [2035, 10, 4]
];

const toDate = (ymd) => new Date(ymd[0], ymd[1] - 1, ymd[2]);
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const dateKey = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

// Gregorian Easter Sunday (Meeus/Jones/Butcher)
const easter = (y) => {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  return new Date(y, Math.floor(n / 31) - 1, n % 31 + 1);
}

const christianHolidays = (y) => {
  const e = easter(y);
  return [
    new Date(y, 0, 1),
    addDays(e, -2),  // Good Friday
    addDays(e, 1),   // Easter Monday
    addDays(e, 39),  // Ascension
    addDays(e, 50),  // Whit Monday
    new Date(y, 11, 24), new Date(y, 11, 25), new Date(y, 11, 26)
  ];
}

const jewishHolidays = () => {
  const dates = [];
  ROSH_HASHANAH.forEach((ymd) => {
    const roshHashanah = toDate(ymd);
    dates.push(roshHashanah, addDays(roshHashanah, 1), addDays(roshHashanah, 9), addDays(roshHashanah, -163));
  });
  return dates;
}

const isReligiousHoliday = (date) => {
  const holidays = christianHolidays(date.getFullYear())
    .concat(EID_AL_FITR.map(toDate), EID_AL_ADHA.map(toDate), jewishHolidays());
  return holidays.some((holiday) => dateKey(holiday) === dateKey(date));
}

const isAdShownToday = (now) => new RegExp(`(^|;\\s*)${AD_COOKIE_NAME}=${dateKey(now)}(;|$)`).test(document.cookie);

const isAlternativeAdTime = (now) => {
  const day = now.getDay();
  const hour = now.getHours();
  return day >= 1 && day <= 5
    && hour >= AD_FROM_HOUR && hour < AD_UNTIL_HOUR
    && !isReligiousHoliday(now);
}

// Called on each carousel step; a true result means the ad is displayed now.
const shouldShowAd = () => {
  const now = new Date();
  if (isAdShownToday(now) || Math.random() >= AD_CHANCE) {
    return false;
  }
  document.cookie = `${AD_COOKIE_NAME}=${dateKey(now)};max-age=86400;path=/;domain=bitch.hu;secure`;
  return true;
}

// Called each time the ad is shown: where it leads.
const adHref = () => {
  const now = new Date();
  return AD_ALTERNATIVE_URL !== null && isAlternativeAdTime(now) && Math.random() < AD_ALTERNATIVE_CHANCE ? AD_ALTERNATIVE_URL : AD_URL;
}
