"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const string_1 = require("./string");
describe("String util", () => {
    it("should work for endsWith", () => {
        chai_1.expect(string_1.endsWithValueFromList("aaa", ["aa"])).equal(true);
        chai_1.expect(string_1.endsWithValueFromList("aaa", ["aa", , "bb"])).equal(true);
        chai_1.expect(string_1.endsWithValueFromList("aaa", ["bb", "cc"])).equal(false);
    });
});
