import dotenv from 'dotenv'
import express from 'express'
import stripe from 'stripe'

import { WebhookClient } from 'discord.js'

const app = express() as express.Express;
const port = process.env.PORT ? process.env.PORT : 3000

export const Webhook = new WebhookClient('707256211443023922', 'eJvHqTYjuSP9qrUlr81LdPVqyZGFA3ypwN0e7-tgaX5vjB1-iQLGlxEjpitEhogsh8kG')
export const Stripe = new stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
})

dotenv.config()

app.set('trust proxy', true);
app.set('json spaces', 2);

import Api from './routes/api'

app.use(express.json());
app.use('/api', Api);

app.listen(port, (): void => {
    console.log('App is listening on port:', port)
});