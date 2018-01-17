"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helpers_1 = require("../helpers");
describe("String util", () => {
    it("should work for endsWith", () => {
        chai_1.expect(helpers_1.strEndsWithValueFromList("aaa", ["aa"])).equal(true);
        chai_1.expect(helpers_1.strEndsWithValueFromList("aaa", ["aa", , "bb"])).equal(true);
        chai_1.expect(helpers_1.strEndsWithValueFromList("aaa", ["bb", "cc"])).equal(false);
    });
});
