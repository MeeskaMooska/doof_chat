// Get env
const { env } = require("process");

async function handler(event) {
    const prompt = event.queryStringParameters?.prompt || 'default prompt'; // Retrieve the prompt from the request, or set a default.

    // Send prompt to the server via GET request with query parameters
    const response = await fetch(`http://${env.MODEL_API_URL}/process_request?message=${encodeURIComponent(prompt)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
}

// Export the handler function using CommonJS
module.exports = { handler };
