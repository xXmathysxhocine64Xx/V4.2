import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request) {
  try {
    const body = await request.json()
    const { package_id, metadata } = body
    
    // Get origin URL from request headers
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const origin_url = `${protocol}://${host}`
    
    const payload = {
      package_id,
      origin_url,
      metadata: metadata || {}
    }
    
    // Call Python backend API
    const { stdout, stderr } = await execAsync(
      `cd /app && python3 -c "
import asyncio
import os
import sys
import json
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
from uuid import uuid4
from datetime import datetime
from pymongo import MongoClient

async def create_checkout():
    try:
        # Get environment variables
        stripe_api_key = os.environ.get('STRIPE_API_KEY')
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        
        if not stripe_api_key:
            raise Exception('STRIPE_API_KEY not found')
        
        # Parse input
        payload = json.loads(sys.argv[1])
        package_id = payload['package_id']
        origin_url = payload['origin_url']
        metadata = payload.get('metadata', {})
        
        # Define fixed packages (SECURITY: amounts defined on backend only)
        PACKAGES = {
            'test_free': {'amount': 0.00, 'name': 'Pizza Test Gratuite (Démo)', 'is_test': True},
            'small_pizza': {'amount': 12.90, 'name': 'Pizza Petite'},
            'medium_pizza': {'amount': 16.90, 'name': 'Pizza Moyenne'}, 
            'large_pizza': {'amount': 19.90, 'name': 'Pizza Grande'},
            'family_pizza': {'amount': 24.90, 'name': 'Pizza Familiale'},
            'margherita': {'amount': 12.90, 'name': 'Pizza Margherita'},
            'napoletana': {'amount': 15.90, 'name': 'Pizza Napoletana'},
            'quattro_formaggi': {'amount': 18.90, 'name': 'Pizza Quattro Formaggi'},
            'diavola': {'amount': 17.90, 'name': 'Pizza Diavola'},
            'vegetariana': {'amount': 16.90, 'name': 'Pizza Végétarienne'},
            'prosciutto': {'amount': 19.90, 'name': 'Pizza Prosciutto'}
        }
        
        # Validate package exists
        if package_id not in PACKAGES:
            raise Exception(f'Invalid package: {package_id}')
        
        package = PACKAGES[package_id]
        amount = package['amount']
        
        # Initialize Stripe
        host_url = origin_url
        webhook_url = f'{host_url}/api/webhook/stripe'
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        # Build success and cancel URLs
        success_url = f'{origin_url}/pizza/success?session_id={{CHECKOUT_SESSION_ID}}'
        cancel_url = f'{origin_url}/pizza'
        
        # Add pizza info to metadata
        metadata.update({
            'package_id': package_id,
            'pizza_name': package['name'],
            'source': 'lucky_pizza_lannilis',
            'created_at': datetime.now().isoformat()
        })
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=amount,
            currency='eur',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Connect to MongoDB and save transaction
        client = MongoClient(mongo_url)
        db = client['getyoursite']
        transactions_collection = db['payment_transactions']
        
        # Create transaction record
        transaction_data = {
            'session_id': session.session_id,
            'package_id': package_id,
            'pizza_name': package['name'],
            'amount': amount,
            'currency': 'EUR',
            'payment_status': 'pending',
            'status': 'initiated',
            'metadata': metadata,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        transactions_collection.insert_one(transaction_data)
        client.close()
        
        # Return response
        response = {
            'url': session.url,
            'session_id': session.session_id,
            'amount': amount,
            'currency': 'EUR',
            'pizza_name': package['name']
        }
        
        print(json.dumps(response))
        
    except Exception as e:
        error_response = {'error': str(e)}
        print(json.dumps(error_response))
        sys.exit(1)

asyncio.run(create_checkout())
" '${JSON.stringify(payload)}'`
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
    console.error('Checkout creation error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}