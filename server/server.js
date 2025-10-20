require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(secretKey);

app.use(express.json());

const YOUR_DOMAIN = "http://localhost:5173/";

app.post("/api/payment_intents", async (req, res) => {
	const {amount, currency} = req.body;
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: currency,
			payment_method_types: ["card"],
		});
		res.json({clientSecret: paymentIntent.client_secret});
	} catch (error) {
		console.error("Erreur Stripe :", error);
		res.status(500).json({
			error: "Échec de la création du PaymentIntent",
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
