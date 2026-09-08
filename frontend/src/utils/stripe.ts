import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripeTestAssistantEnabled =
    import.meta.env.VITE_STRIPE_TEST_ASSISTANT === "true";

export const stripeInstanceOptions = {
    developerTools: {
        assistant: {
            enabled: stripeTestAssistantEnabled,
        },
    },
};

export const stripePromise = loadStripe(
    stripePublishableKey,
    stripeInstanceOptions,
);
