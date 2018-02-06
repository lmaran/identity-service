import { expect } from "chai";
import * as err from "../../errors";

const err1 = new err.ValidationError("err1");
// .withStatus(422).returnAs("render");
expect(err1.status).equals(400);
expect(err1.returnAs).equals("json");

const err2 = new err.ApplicationError(300, "err1");
expect(err2.status).equals(300);
expect(err2.returnAs).equals("json");
