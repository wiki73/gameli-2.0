export const levelToExperienceMap = new Map<number, number>([
  [1, 0],
  [2, 200],
  [3, 500],
  [4, 900],
  [5, 1500],
  [6, 2000],
  [7, 2500],
  [8, 3000],
  [9, 3500],
  [10, 4000],
  [11, 4500],
  [12, 5000],
  [13, 5500],
  [14, 6000],
]);

export const experienceToLevelMap = new Map<number, number>([
  [0, 1],
  [200, 2],
  [500, 3],
  [900, 4],
  [1500, 5],
  [2000, 6],
  [2500, 7],
  [3000, 8],
  [3500, 9],
  [4000, 10],
  [4500, 11],
  [5000, 12],
  [5500, 13],
  [6000, 14],
]);

export const getExperienceByLevel = (level: number): number =>
  levelToExperienceMap.get(level) ?? 0;

export const getLevelByExperience = (experience: number): number => {
  let level = 0;
  levelToExperienceMap.forEach((value, key) => {
    if (value <= experience) {
      level = key;
    }
  });

  return level;
};
