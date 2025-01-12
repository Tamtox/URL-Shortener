export const zodStringToNumberPreprocessor = (value: any): number | null => {
  const type = typeof value;
  if (type === 'number') {
    return Number(value);
  } else if (type === 'string') {
    const isNumber = !isNaN(Number(value));
    return isNumber ? Number(value) : null;
  } else {
    return null;
  }
};
