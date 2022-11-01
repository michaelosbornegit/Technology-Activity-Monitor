"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.SessionController = void 0;
// src/users/usersController.ts
const tsoa_1 = require("tsoa");
const session_1 = require("../Services/session");
const body_parser_1 = __importDefault(require("body-parser"));
let SessionController = class SessionController extends tsoa_1.Controller {
    getSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new session_1.SessionService().getAll();
        });
    }
    postSessions(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new session_1.SessionService().create(body.sessions);
        });
    }
    postChromeSession(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new session_1.SessionService().createChromeSession(body);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("all")
], SessionController.prototype, "getSessions", null);
__decorate([
    (0, tsoa_1.Post)("/desktop"),
    (0, tsoa_1.SuccessResponse)('201', 'Session Created'),
    __param(0, (0, tsoa_1.Body)())
], SessionController.prototype, "postSessions", null);
__decorate([
    (0, tsoa_1.Post)("/chrome"),
    (0, tsoa_1.SuccessResponse)('201', 'Session Created'),
    __param(0, (0, tsoa_1.Body)())
], SessionController.prototype, "postChromeSession", null);
SessionController = __decorate([
    (0, tsoa_1.Route)("session"),
    (0, tsoa_1.Middlewares)(body_parser_1.default.urlencoded({ extended: true }), body_parser_1.default.json())
], SessionController);
exports.SessionController = SessionController;
