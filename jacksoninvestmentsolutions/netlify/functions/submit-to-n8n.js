// netlify/functions/submit-to-n8n.js
const fetch = require('node-fetch'); // For making HTTP requests in Node.js

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse URL-encoded form data
    const submittedData = new URLSearchParams(event.body);
    const payload = {};
    for (const [key, value] of submittedData.entries()) {
        payload[key] = value;
    }

    // Identify which form was submitted
    const formName = payload['form-name'] || 'unknown';
    payload['formName'] = formName; // Add a normalized field for n8n

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
        console.error('N8N_WEBHOOK_URL environment variable is not set!');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server configuration error: N8n URL missing.' })
        };
    }

    try {
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error sending data to n8n:', response.status, errorText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ message: 'Failed to send data to automation service.' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted and sent to automation successfully!' })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error during form processing.' })
        };
    }
};
