"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSessions = exports.insertSessions = void 0;
const common_1 = __importDefault(require("./common"));
const SESSION_TABLE = "sessions";
const insertSessions = (sessions) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(sessions);
    yield (0, common_1.default)("sessions").insert(sessions);
});
exports.insertSessions = insertSessions;
const allSessions = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, common_1.default)(SESSION_TABLE).select();
    return results;
});
exports.allSessions = allSessions;
