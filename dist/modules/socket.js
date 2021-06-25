"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationFailures = exports.totalPageLoads = exports.activeSessions = exports.totalSessions = exports.sessionLogs = exports.launch = void 0;
const app_1 = require("../app");
let totalSessions = 0;
exports.totalSessions = totalSessions;
let totalPageLoads = 0;
exports.totalPageLoads = totalPageLoads;
let activeSessions = 0;
exports.activeSessions = activeSessions;
let verificationFailures = 1;
exports.verificationFailures = verificationFailures;
let sessionLogs = new Array;
exports.sessionLogs = sessionLogs;
app_1.Socket.on('connection', (io) => {
    try {
        (exports.activeSessions = activeSessions += 1);
        (exports.totalPageLoads = totalPageLoads += 1);
        let id = io.handshake.headers.cookie.split(';')[0].split('usps.id=')[1];
        if (!sessionLogs.find(x => x.id === id)) {
            (exports.totalSessions = totalSessions += 1);
            sessionLogs.push({ id });
            console.log(activeSessions, 'New user has connected', io.handshake.headers.cookie.split(';')[0].split('usps.id=')[1]);
        }
        io.on('disconnect', () => {
            (exports.activeSessions = activeSessions -= 1);
            console.log(activeSessions, 'Some user has disconnected', io.handshake.headers.cookie.split(';')[0].split('usps.id=')[1]);
        });
    }
    catch (error) {
        console.log(error);
    }
});
const launch = () => {
    console.log('Socket connection established');
};
exports.launch = launch;
//# sourceMappingURL=socket.js.map