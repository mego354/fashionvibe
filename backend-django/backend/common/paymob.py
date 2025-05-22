"""
Paymob integration for the Fashion Hub project.
"""

from django.conf import settings
import requests
import json
import logging
import uuid

logger = logging.getLogger(__name__)


class PaymobClient:
    """
    Paymob client for payment processing.
    """
    
    def __init__(self):
        """
        Initialize the Paymob client.
        """
        self.api_key = settings.PAYMOB_API_KEY
        self.integration_id = settings.PAYMOB_INTEGRATION_ID
        self.iframe_id = settings.PAYMOB_IFRAME_ID
        self.hmac_secret = settings.PAYMOB_HMAC_SECRET
        self.base_url = "https://accept.paymob.com/api"
        self.auth_token = None
    
    def authenticate(self):
        """
        Authenticate with Paymob API and get auth token.
        """
        url = f"{self.base_url}/auth/tokens"
        payload = {"api_key": self.api_key}
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        self.auth_token = data.get("token")
        
        return self.auth_token
    
    def register_order(self, amount_cents, currency="EGP", items=None):
        """
        Register an order with Paymob.
        
        Args:
            amount_cents: Amount in cents
            currency: Currency code (default: EGP)
            items: List of order items (optional)
            
        Returns:
            Order ID from Paymob
        """
        if not self.auth_token:
            self.authenticate()
        
        url = f"{self.base_url}/ecommerce/orders"
        
        payload = {
            "auth_token": self.auth_token,
            "delivery_needed": "false",
            "amount_cents": amount_cents,
            "currency": currency,
            "items": items or []
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        order_id = data.get("id")
        
        return order_id
    
    def get_payment_key(self, order_id, amount_cents, currency="EGP", billing_data=None):
        """
        Get a payment key for processing a payment.
        
        Args:
            order_id: Paymob order ID
            amount_cents: Amount in cents
            currency: Currency code (default: EGP)
            billing_data: Customer billing data
            
        Returns:
            Payment key
        """
        if not self.auth_token:
            self.authenticate()
        
        url = f"{self.base_url}/acceptance/payment_keys"
        
        # Default billing data if not provided
        if not billing_data:
            billing_data = {
                "apartment": "NA",
                "email": "customer@example.com",
                "floor": "NA",
                "first_name": "Customer",
                "street": "NA",
                "building": "NA",
                "phone_number": "+201000000000",
                "shipping_method": "NA",
                "postal_code": "NA",
                "city": "NA",
                "country": "EG",
                "last_name": "Customer",
                "state": "NA"
            }
        
        payload = {
            "auth_token": self.auth_token,
            "amount_cents": amount_cents,
            "expiration": 3600,
            "order_id": order_id,
            "billing_data": billing_data,
            "currency": currency,
            "integration_id": self.integration_id
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        payment_key = data.get("token")
        
        return payment_key
    
    def get_payment_url(self, payment_key):
        """
        Get the payment URL for the iframe.
        
        Args:
            payment_key: Payment key
            
        Returns:
            Payment URL
        """
        return f"https://accept.paymob.com/api/acceptance/iframes/{self.iframe_id}?payment_token={payment_key}"
    
    def process_payment(self, amount_cents, order_items, customer_data, currency="EGP"):
        """
        Process a payment from start to finish.
        
        Args:
            amount_cents: Amount in cents
            order_items: List of order items
            customer_data: Customer billing data
            currency: Currency code (default: EGP)
            
        Returns:
            Payment URL and payment reference
        """
        # Generate a unique payment reference
        payment_reference = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        
        # Step 1: Authenticate
        self.authenticate()
        
        # Step 2: Register order
        order_id = self.register_order(amount_cents, currency, order_items)
        
        # Step 3: Get payment key
        payment_key = self.get_payment_key(order_id, amount_cents, currency, customer_data)
        
        # Step 4: Get payment URL
        payment_url = self.get_payment_url(payment_key)
        
        return {
            "payment_reference": payment_reference,
            "order_id": order_id,
            "payment_key": payment_key,
            "payment_url": payment_url
        }
    
    def verify_transaction(self, transaction_id):
        """
        Verify a transaction with Paymob.
        
        Args:
            transaction_id: Transaction ID
            
        Returns:
            Transaction data
        """
        if not self.auth_token:
            self.authenticate()
        
        url = f"{self.base_url}/acceptance/transactions/{transaction_id}"
        
        response = requests.get(url, params={"token": self.auth_token})
        response.raise_for_status()
        
        return response.json()
    
    def refund_transaction(self, transaction_id, amount_cents, reason=None):
        """
        Refund a transaction.
        
        Args:
            transaction_id: Transaction ID
            amount_cents: Amount to refund in cents
            reason: Reason for refund (optional)
            
        Returns:
            Refund data
        """
        if not self.auth_token:
            self.authenticate()
        
        url = f"{self.base_url}/acceptance/void_refund/refund"
        
        payload = {
            "auth_token": self.auth_token,
            "transaction_id": transaction_id,
            "amount_cents": amount_cents
        }
        
        if reason:
            payload["reason"] = reason
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        return response.json()
    
    def verify_webhook_signature(self, request_data, hmac_header):
        """
        Verify the HMAC signature of a webhook request.
        
        Args:
            request_data: Request data as a dictionary
            hmac_header: HMAC header from the request
            
        Returns:
            True if signature is valid, False otherwise
        """
        import hmac
        import hashlib
        
        if not self.hmac_secret:
            logger.warning("HMAC secret not configured, skipping signature verification")
            return True
        
        # Convert request data to string and sort keys
        data_string = json.dumps(request_data, sort_keys=True).encode('utf-8')
        
        # Calculate HMAC
        calculated_hmac = hmac.new(
            self.hmac_secret.encode('utf-8'),
            data_string,
            hashlib.sha512
        ).hexdigest()
        
        return calculated_hmac == hmac_header
