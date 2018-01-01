"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service = {
    endsWithValueFromList: (str, endValues) => {
        return endValues.some(v => str.endsWith(v));
    },
};
exports.default = service;
