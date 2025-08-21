import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(request, { params }) {
  try {
    const sessionId = params.sessionId
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    // Call Python backend to check payment status
    const { stdout, stderr } = await execAsync(
      `cd /app && python3 -c "
import asyncio
import os
import sys
import json
from emergentintegrations.payments.stripe.checkout import StripeCheckout
from pymongo import MongoClient
from datetime import datetime

async def check_payment_status():
    try:
        # Get environment variables
        stripe_api_key = os.environ.get('STRIPE_API_KEY')
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        
        if not stripe_api_key:
            raise Exception('STRIPE_API_KEY not found')
        
        session_id = sys.argv[1]
        
        # Connect to MongoDB first to check if it's a test transaction
        client = MongoClient(mongo_url)
        db = client['getyoursite']
        transactions_collection = db['payment_transactions']
        
        # Find transaction in database
        transaction = transactions_collection.find_one({'session_id': session_id})
        
        # Handle test free pizza sessions
        if transaction and transaction.get('test_mode') == True:
            result = {
                'session_id': session_id,
                'status': transaction.get('status', 'test_success'),
                'payment_status': transaction.get('payment_status', 'completed_test'),
                'amount_total': transaction.get('amount', 0),
                'currency': transaction.get('currency', 'EUR'),
                'pizza_name': transaction.get('pizza_name', ''),
                'is_test': True,
                'message': 'Pizza gratuite de test - commande confirmée!'
            }
            client.close()
            print(json.dumps(result))
            return
        
        # Initialize Stripe for paid transactions
        stripe_checkout = StripeCheckout(api_key=stripe_api_key)
        
        # Get checkout status from Stripe
        checkout_status = await stripe_checkout.get_checkout_status(session_id)
        
        if transaction:
            # Update transaction status if payment completed and not already processed
            if (checkout_status.payment_status == 'paid' and 
                transaction.get('payment_status') != 'paid'):
                
                update_data = {
                    'payment_status': checkout_status.payment_status,
                    'status': checkout_status.status,
                    'updated_at': datetime.now().isoformat(),
                    'completed_at': datetime.now().isoformat() if checkout_status.payment_status == 'paid' else None
                }
                
                transactions_collection.update_one(
                    {'session_id': session_id},
                    {'$set': update_data}
                )
                
                print(f'Transaction {session_id} updated to {checkout_status.payment_status}')
            
            elif (checkout_status.status in ['expired', 'canceled'] and 
                  transaction.get('status') not in ['expired', 'canceled']):
                  
                update_data = {
                    'payment_status': checkout_status.payment_status,
                    'status': checkout_status.status,
                    'updated_at': datetime.now().isoformat()
                }
                
                transactions_collection.update_one(
                    {'session_id': session_id},
                    {'$set': update_data}
                )
        
        client.close()
        
        # Return status response
        response = {
            'session_id': session_id,
            'status': checkout_status.status,
            'payment_status': checkout_status.payment_status,
            'amount_total': checkout_status.amount_total,
            'currency': checkout_status.currency.upper(),
            'metadata': checkout_status.metadata
        }
        
        print(json.dumps(response))
        
    except Exception as e:
        error_response = {'error': str(e)}
        print(json.dumps(error_response))
        sys.exit(1)

asyncio.run(check_payment_status())
" '${sessionId}'`
    )
    
    if (stderr && !stderr.includes('InsecureRequestWarning')) {
      console.error('Python error:', stderr)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    
    const result = JSON.parse(stdout.trim())
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 })
  }
}