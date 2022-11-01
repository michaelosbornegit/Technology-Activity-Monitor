"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const environment_1 = __importDefault(require("../environment"));
exports.default = (0, knex_1.default)({
    client: 'pg',
    connection: environment_1.default.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
});
