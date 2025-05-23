from django.utils.deprecation import MiddlewareMixin
from stores.models import Store
from django.contrib.auth import get_user_model

User = get_user_model()

class TenantMiddleware(MiddlewareMixin):
    """
    Middleware to set request.tenant based on the domain or authenticated user's store.
    """
    def process_request(self, request):
        # Try to get tenant by domain (Host header)
        host = request.get_host().split(':')[0]
        try:
            store = Store.objects.get(domains__domain=host)
            request.tenant = store
            return
        except Store.DoesNotExist:
            pass
        # Fallback: if user is authenticated, use their store
        user = getattr(request, 'user', None)
        if user and user.is_authenticated and hasattr(user, 'store'):
            request.tenant = user.store
        else:
            request.tenant = None 