import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 })
    }
    
    // Call Python backend to handle webhook
    const { stdout, stderr } = await execAsync(
      `cd /app && python3 -c "
import asyncio
import os
import sys
import json
from emergentintegrations.payments.stripe.checkout import StripeCheckout
from pymongo import MongoClient
from datetime import datetime

async def handle_stripe_webhook():
    try:
        # Get environment variables
        stripe_api_key = os.environ.get('STRIPE_API_KEY')
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        
        if not stripe_api_key:
            raise Exception('STRIPE_API_KEY not found')
        
        # Get webhook data
        webhook_body = sys.argv[1]
        signature = sys.argv[2]
        
        # Initialize Stripe
        stripe_checkout = StripeCheckout(api_key=stripe_api_key)
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(
            webhook_body.encode(), 
            {'Stripe-Signature': signature}
        )
        
        # Connect to MongoDB
        client = MongoClient(mongo_url)
        db = client['getyoursite']
        transactions_collection = db['payment_transactions']
        
        # Update transaction based on webhook event
        if webhook_response.session_id:
            transaction = transactions_collection.find_one({
                'session_id': webhook_response.session_id
            })
            
            if transaction:
                update_data = {
                    'payment_status': webhook_response.payment_status,
                    'event_type': webhook_response.event_type,
                    'event_id': webhook_response.event_id,
                    'updated_at': datetime.now().isoformat()
                }
                
                # Add completion time if payment successful
                if webhook_response.payment_status == 'paid':
                    update_data['completed_at'] = datetime.now().isoformat()
                
                transactions_collection.update_one(
                    {'session_id': webhook_response.session_id},
                    {'$set': update_data}
                )
                
                print(f'Webhook processed: {webhook_response.event_type} for {webhook_response.session_id}')
        
        client.close()
        
        response = {
            'received': True,
            'event_type': webhook_response.event_type,
            'session_id': webhook_response.session_id
        }
        
        print(json.dumps(response))
        
    except Exception as e:
        error_response = {'error': str(e)}
        print(json.dumps(error_response))
        sys.exit(1)

asyncio.run(handle_stripe_webhook())
" '${body}' '${signature}'`
    )
    
    if (stderr && !stderr.includes('InsecureRequestWarning')) {
      console.error('Webhook error:', stderr)
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
    
    const result = JSON.parse(stdout.trim())
    
    if (result.error) {
      console.error('Webhook processing error:', result.error)
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}