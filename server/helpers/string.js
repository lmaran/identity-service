"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strEndsWithValueFromList = (str, endValues) => {
    return endValues.some(v => str.endsWith(v));
};
