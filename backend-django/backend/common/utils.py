"""
Common utilities for the Fashion Hub project.
"""

import uuid
from django.utils.text import slugify


def generate_unique_slug(instance, field_name, new_slug=None):
    """
    Generate a unique slug for a model instance.
    
    Args:
        instance: Model instance
        field_name: Field to use for slug generation
        new_slug: Optional predefined slug
        
    Returns:
        A unique slug string
    """
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(getattr(instance, field_name))
    
    # Get the model class
    model_class = instance.__class__
    
    # Check if slug exists
    slug_exists = model_class.objects.filter(slug=slug).exists()
    
    if slug_exists:
        # Generate a unique UUID
        new_slug = f"{slug}-{uuid.uuid4().hex[:8]}"
        # Recursive call with the new slug
        return generate_unique_slug(instance, field_name, new_slug=new_slug)
    
    return slug


def get_file_path(instance, filename):
    """
    Generate a unique file path for uploaded files.
    
    Args:
        instance: Model instance
        filename: Original filename
        
    Returns:
        A unique file path string
    """
    # Get the model name
    model_name = instance.__class__.__name__.lower()
    
    # Generate a unique ID
    unique_id = uuid.uuid4().hex
    
    # Get the file extension
    ext = filename.split('.')[-1]
    
    # Return the unique path
    return f"{model_name}/{unique_id}.{ext}"
