import { expect } from "chai";
import * as chai from "chai";
import * as sinon from "sinon";

import { stringHelper } from "../../helpers";

describe("String util", () => {

    it("should work for endsWith", () => {
        expect(stringHelper.endsWithValueFromList("aaa", ["aa"])).equal(true);
        expect(stringHelper.endsWithValueFromList("aaa", ["aa", "", "bb"])).equal(true);
        expect(stringHelper.endsWithValueFromList("aaa", ["bb", "cc"])).equal(false);
    });

    // it("should work for equalsWith", () => {
    //     expect(stringUtil.equalsWithValueFromList("aaa", ["aa"])).equal(false);
    //     expect(stringUtil.equalsWithValueFromList("aaa", ["aa", , "aaa"])).equal(true);
    // });

});
