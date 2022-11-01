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
exports.allChromeSessions = exports.insertChromeSession = void 0;
const common_1 = __importDefault(require("./common"));
const CHROME_SESSION_TABLE = "chrome-sessions";
const insertChromeSession = (session) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(session);
    yield (0, common_1.default)(CHROME_SESSION_TABLE).insert(session);
});
exports.insertChromeSession = insertChromeSession;
const allChromeSessions = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, common_1.default)(CHROME_SESSION_TABLE).select();
    return results;
});
exports.allChromeSessions = allChromeSessions;
