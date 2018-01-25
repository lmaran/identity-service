"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringHelper = {
    endsWithValueFromList: (str, endValues) => {
        return endValues.some(v => str.endsWith(v));
    },
};
