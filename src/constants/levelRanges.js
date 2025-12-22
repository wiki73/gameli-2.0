export const LEVEL_RANGES = [
    { maxExp: 100, level: 1 },
    { maxExp: 300, level: 2 },
    { maxExp: 500, level: 3 },
    { maxExp: 600, level: 4 },
    { maxExp: 1000, level: 5 },
    { maxExp: 1200, level: 7 },
    { maxExp: Infinity, level: 10 },
];

export const getLevelByExp = (exp) => {
    for (const range of LEVEL_RANGES) {
        if (exp < range.maxExp) {
            return range.level;
        }
    }
    return 1;
};
