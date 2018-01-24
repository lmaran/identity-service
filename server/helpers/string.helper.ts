export const stringHelper = {
    endsWithValueFromList: (str: string, endValues: string[]): boolean => {
        return endValues.some(v => str.endsWith(v));
    },
};
