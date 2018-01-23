import { expect } from "chai";
import * as chai from "chai";
import * as sinon from "sinon";

import { strEndsWithValueFromList } from "../helpers";

describe("String util", () => {

    it("should work for endsWith", () => {
        expect(strEndsWithValueFromList("aaa", ["aa"])).equal(true);
        expect(strEndsWithValueFromList("aaa", ["aa", "", "bb"])).equal(true);
        expect(strEndsWithValueFromList("aaa", ["bb", "cc"])).equal(false);
    });

    // it("should work for equalsWith", () => {
    //     expect(stringUtil.equalsWithValueFromList("aaa", ["aa"])).equal(false);
    //     expect(stringUtil.equalsWithValueFromList("aaa", ["aa", , "aaa"])).equal(true);
    // });

});
