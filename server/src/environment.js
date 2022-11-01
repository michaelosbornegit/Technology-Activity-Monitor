"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
let dotenvPath = path_1.default.resolve(process.cwd(), '.env');
dotenv_1.default.config({ path: dotenvPath });
const { API_HOST = '', APP_HOST = '', PORT = '5501', PG_CONNECTION_STRING = '' } = process.env;
const env = {
    API_HOST,
    APP_HOST,
    PORT,
    PG_CONNECTION_STRING
};
exports.default = env;
