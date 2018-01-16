export const endsWithValueFromList = (str: string, endValues: string[]) => {
    return endValues.some(v => str.endsWith(v));
};
