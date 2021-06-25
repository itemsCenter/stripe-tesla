import { MessageEmbed } from 'discord.js';
import { Router } from 'express';

import { Stripe, Webhook } from '../app';
import { Tesla } from '../modules/tesla-api';

const router = Router()

router.post('/webhook', (req, res) => {

    let event;

    const tesla = new Tesla()
    const signature = req.headers['stripe-signature'] as string;

    try {
        event = Stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
      }
      catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event) {
        case 'payment_intent.succeeded':
            if (req.body.data.object.metadata.discordID){
                tesla.horn()
                .then((): void => {
                    Webhook.send(
                        new MessageEmbed()
                        .setAuthor('Grass Proxies')
                        .setTitle('Horn Succeeded')
                        .setColor('#36393F')
                    )
                })
                .catch((): void => {
                    Webhook.send(
                        new MessageEmbed()
                        .setAuthor('Grass Proxies')
                        .setTitle('Horn Failed')
                        .setColor('#36393F')
                    )
                })
            }
    }

    return res.status(201).end()
})



export = router