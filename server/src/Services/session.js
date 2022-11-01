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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const chrome_session_model_1 = require("../Models/chrome-session.model");
const session_model_1 = require("../Models/session.model");
class SessionService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, session_model_1.allSessions)();
        });
    }
    create(sessions) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, session_model_1.insertSessions)(sessions);
        });
    }
    createChromeSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, chrome_session_model_1.insertChromeSession)(session);
        });
    }
}
exports.SessionService = SessionService;
