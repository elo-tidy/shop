require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(secretKey);

app.use(cors());
app.use(express.json());

const YOUR_DOMAIN = "http://localhost:5173/";

app.post("/api/payment_intents", async (req, res) => {
	const {amount, currency, metadata} = req.body;
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: currency,
			payment_method_types: ["card"],
			metadata: metadata,
		});
		console.log("paymentIntent.id", paymentIntent.id);
		res.json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
		});
	} catch (error) {
		console.error("Erreur Stripe :", error);
		res.status(500).json({
			error: "Échec de la création du PaymentIntent",
		});
	}
});

app.post("/api/payment_intents/update", async (req, res) => {
	const {paymentIntentId, userId} = req.body;

	if (!paymentIntentId) {
		return res.status(400).json({error: "paymentIntentId requis"});
	}

	try {
		const updatedPaymentIntent = await stripe.paymentIntents.update(
			paymentIntentId,
			{
				metadata: {userId},
			}
		);

		console.log("PaymentIntent mis à jour :", updatedPaymentIntent.id);

		res.json({
			clientSecret: updatedPaymentIntent.client_secret,
			paymentIntentId: updatedPaymentIntent.id,
		});
	} catch (err) {
		console.error("Erreur update PaymentIntent :", err);
		res.status(500).json({
			error: "Impossible de mettre à jour le PaymentIntent",
		});
	}
});

app.get("/api/payment_intents/:id", async (req, res) => {
	const paymentIntentId = req.params.id;
	try {
		const paymentIntent = await stripe.paymentIntents.retrieve(
			paymentIntentId
		);
		res.json(paymentIntent);
		console.log(paymentIntent);
	} catch (error) {
		console.error("Erreur Stripe :", error);
		res.status(500).json({
			error: "Échec de la récupération du PaymentIntent",
		});
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
