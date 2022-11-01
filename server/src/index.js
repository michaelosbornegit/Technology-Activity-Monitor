"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const environment_1 = __importDefault(require("./environment"));
const port = parseInt((_a = environment_1.default.PORT) !== null && _a !== void 0 ? _a : '8080');
app_1.default.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
