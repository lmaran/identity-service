"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dal_1 = require("./client.dal");
const clientService = {
    getById: (id) => __awaiter(this, void 0, void 0, function* () {
        const client = yield client_dal_1.default.getById(id);
        return (client);
    }),
    getClient: (id) => {
        const client = client_dal_1.default.getClient(id);
        return (client);
    },
};
exports.default = clientService;
