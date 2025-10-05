// NowPayments IPN (Instant Payment Notification) handler
// This handles incoming payment notifications from NowPayments

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
    
    // NowPayments IPN validation
    // You should implement proper signature verification here
    // const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    // const signature = event.headers['x-nowpayments-sig'];
    
    console.log('NowPayments IPN received:', body);

    // Validate IPN data structure
    if (!body.payment_id || !body.payment_status) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid IPN data' }),
      };
    }

    // Process different payment statuses
    switch (body.payment_status) {
      case 'waiting':
        console.log('Payment waiting for confirmation:', body.payment_id);
        break;
        
      case 'confirming':
        console.log('Payment confirming:', body.payment_id);
        break;
        
      case 'confirmed':
        console.log('Payment confirmed:', body.payment_id);
        // Update user balance, activate services, etc.
        await processConfirmedPayment(body);
        break;
        
      case 'sending':
        console.log('Payment sending:', body.payment_id);
        break;
        
      case 'partially_paid':
        console.log('Payment partially paid:', body.payment_id);
        break;
        
      case 'finished':
        console.log('Payment finished:', body.payment_id);
        await processFinishedPayment(body);
        break;
        
      case 'failed':
        console.log('Payment failed:', body.payment_id);
        await processFailedPayment(body);
        break;
        
      case 'refunded':
        console.log('Payment refunded:', body.payment_id);
        await processRefundedPayment(body);
        break;
        
      default:
        console.log('Unknown payment status:', body.payment_status);
    }

    // Return success response to NowPayments
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true,
        message: 'IPN processed successfully' 
      }),
    };
  } catch (error) {
    console.error('NowPayments IPN processing error:', error);
    
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

// Helper functions for processing payments
async function processConfirmedPayment(paymentData) {
  // Implement your logic for confirmed payments
  // e.g., update user balance, send confirmation email
  console.log('Processing confirmed payment:', paymentData.payment_id);
}

async function processFinishedPayment(paymentData) {
  // Implement your logic for finished payments
  // e.g., activate purchased services, update order status
  console.log('Processing finished payment:', paymentData.payment_id);
}

async function processFailedPayment(paymentData) {
  // Implement your logic for failed payments
  // e.g., notify user, update order status
  console.log('Processing failed payment:', paymentData.payment_id);
}

async function processRefundedPayment(paymentData) {
  // Implement your logic for refunded payments
  // e.g., update user balance, deactivate services
  console.log('Processing refunded payment:', paymentData.payment_id);
}
