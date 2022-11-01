"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tsoa_1 = require("tsoa");
const http_1 = require("http");
const routes_1 = require("./oapi/routes");
const environment_1 = __importDefault(require("./environment"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const allowedHosts = [environment_1.default.APP_HOST, environment_1.default.API_HOST];
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (!origin || allowedHosts.indexOf(origin) !== -1 || origin.includes('localhost')) {
            cb(null, true);
        }
        else {
            cb(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
}));
app.get("/", (req, res) => {
    res.send("hello, world!");
});
(0, routes_1.RegisterRoutes)(app);
app.use(function errorHandler(err, req, res, next) {
    if (err instanceof tsoa_1.ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err === null || err === void 0 ? void 0 : err.fields,
        });
    }
    if (err instanceof Error) {
        console.log(err.stack);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    next();
});
exports.default = server;
