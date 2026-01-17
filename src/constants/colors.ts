export const getColorBySubjectLevel = (level?: number) => {
  if (!level) return '--level-low';
  if (level < 10) return '--level-low';
  if (level < 20) return '--level-medium';
  if (level < 30) return '--level-high';
  return '--level-very-high';
};
