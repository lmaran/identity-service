"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const string_1 = require("./string");
describe("String util", function () {
    it("should work for endsWith", () => {
        chai_1.expect(string_1.default.endsWithValueFromList("aaa", ["aa"])).equal(true);
        chai_1.expect(string_1.default.endsWithValueFromList("aaa", ["aa", , "bb"])).equal(true);
        chai_1.expect(string_1.default.endsWithValueFromList("aaa", ["bb", "cc"])).equal(false);
    });
});
