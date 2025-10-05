// Payment webhook handler for Netlify Functions
// This handles incoming payment notifications

const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const signature = event.headers['x-signature'] || event.headers['X-Signature'];
    
    // Verify webhook signature (implement your verification logic)
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.WEBHOOK_SECRET)
    //   .update(event.body)
    //   .digest('hex');
    
    // if (signature !== expectedSignature) {
    //   return {
    //     statusCode: 401,
    //     body: JSON.stringify({ error: 'Invalid signature' }),
    //   };
    // }

    // Process the webhook data
    console.log('Payment webhook received:', body);

    // Here you would typically:
    // 1. Validate the payment
    // 2. Update your database
    // 3. Send confirmation emails
    // 4. Update user balances
    // 5. Trigger any other business logic

    const response = {
      success: true,
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString(),
      data: body,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};
