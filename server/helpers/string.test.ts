import { expect } from "chai";
import * as chai from "chai";
import * as sinon from "sinon";

import { endsWithValueFromList } from "./string";

describe("String util", () => {

    it("should work for endsWith", () => {
        expect(endsWithValueFromList("aaa", ["aa"])).equal(true);
        expect(endsWithValueFromList("aaa", ["aa", , "bb"])).equal(true);
        expect(endsWithValueFromList("aaa", ["bb", "cc"])).equal(false);
    });

    // it("should work for equalsWith", () => {
    //     expect(stringUtil.equalsWithValueFromList("aaa", ["aa"])).equal(false);
    //     expect(stringUtil.equalsWithValueFromList("aaa", ["aa", , "aaa"])).equal(true);
    // });

});
