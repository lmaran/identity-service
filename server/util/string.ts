const service = {
    /**
     * returns true if "str" ends with at least one value in "endValues" array
     */
    endsWithValueFromList: (str: string, endValues: string[]) => {
        return endValues.some(v => str.endsWith(v));
    },

    // /**
    //  * returns true if "str" equals with at least one value in "endValues" array
    //  */
    // equalsWithValueFromList: (str: string, endValues: string[]) => {
    //     // return endValues.some( v => str === v);
    //     return endValues.includes(str); // ES2017 feature
    // },

};

export default service;