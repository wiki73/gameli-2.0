// import { l } from "react-router/dist/development/index-react-server-client-Cv5Q9lf0";

export const getColorByLevel = level => {
  if (level < 3) return 'brown';
  if (level < 5) return 'yellow';
  if (level < 7) return 'violet';
  if (level < 10) return 'red';
  return 'gold';
};

export const getColorBySubjectLevel = level => {
  if (level < 10) return '--level-low';
  if (level < 20) return '--level-medium';
  if (level < 30) return '--level-high';
  if (level < 40) return '--level-very-high';
  return 'violet';
};
