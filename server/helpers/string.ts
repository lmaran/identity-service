export const strEndsWithValueFromList = (str: string, endValues: string[]): boolean => {
    return endValues.some(v => str.endsWith(v));
};
