export const getColorByLevel = (level) => {
  if (level < 3) return 'brown';
  if (level < 5) return 'yellow';
  if (level < 7) return 'violet';
  if (level < 10) return 'red';
  return 'gold';
};

export const getColorBySubjectLevel = (level) => {
  if (level < 10) return 'brown';
  if (level < 20) return 'yellow';
  if (level < 30) return 'blue';
  return 'violet';
};
