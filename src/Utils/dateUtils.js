// src/Utils/dateUtils.js

export const parseDate = (str) => {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (str) => {
  const date = parseDate(str);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getNextDate = (str) => {
  const date = parseDate(str);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10); // returns 'YYYY-MM-DD'
};
