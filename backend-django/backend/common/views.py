"""
Common views and viewsets for the Fashion Hub project.
"""

from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated


class BaseViewSet(viewsets.ModelViewSet):
    """
    Base viewset with common functionality for all viewsets.
    """
    permission_classes = [IsAuthenticated]


class ReadOnlyViewSet(mixins.RetrieveModelMixin,
                      mixins.ListModelMixin,
                      viewsets.GenericViewSet):
    """
    A viewset that provides only 'read-only' actions.
    """
    permission_classes = [IsAuthenticated]
