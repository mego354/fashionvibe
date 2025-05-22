"""
Redis integration for the Fashion Hub project.
"""

from django.conf import settings
from django.core.cache import cache
import redis
import json
import logging

logger = logging.getLogger(__name__)


class RedisClient:
    """
    Redis client for caching and session management.
    """
    
    def __init__(self):
        """
        Initialize the Redis client.
        """
        self.redis = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD,
            ssl=settings.REDIS_USE_SSL,
            decode_responses=True
        )
    
    def set_cache(self, key, value, timeout=None):
        """
        Set a value in the cache.
        """
        if timeout is None:
            timeout = settings.CACHE_TIMEOUT
        
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        
        self.redis.set(key, value, ex=timeout)
        logger.debug(f"Set cache key: {key}")
    
    def get_cache(self, key, default=None):
        """
        Get a value from the cache.
        """
        value = self.redis.get(key)
        
        if value is None:
            return default
        
        try:
            # Try to parse as JSON
            return json.loads(value)
        except json.JSONDecodeError:
            # Return as is if not JSON
            return value
    
    def delete_cache(self, key):
        """
        Delete a value from the cache.
        """
        self.redis.delete(key)
        logger.debug(f"Deleted cache key: {key}")
    
    def clear_cache(self, pattern="*"):
        """
        Clear all cache keys matching a pattern.
        """
        keys = self.redis.keys(pattern)
        if keys:
            self.redis.delete(*keys)
            logger.info(f"Cleared {len(keys)} cache keys matching pattern: {pattern}")
    
    def increment(self, key, amount=1):
        """
        Increment a counter in Redis.
        """
        return self.redis.incr(key, amount)
    
    def decrement(self, key, amount=1):
        """
        Decrement a counter in Redis.
        """
        return self.redis.decr(key, amount)
    
    def add_to_set(self, key, *values):
        """
        Add values to a Redis set.
        """
        return self.redis.sadd(key, *values)
    
    def remove_from_set(self, key, *values):
        """
        Remove values from a Redis set.
        """
        return self.redis.srem(key, *values)
    
    def get_set_members(self, key):
        """
        Get all members of a Redis set.
        """
        return self.redis.smembers(key)
    
    def add_to_sorted_set(self, key, score, value):
        """
        Add a value to a Redis sorted set.
        """
        return self.redis.zadd(key, {value: score})
    
    def get_sorted_set_range(self, key, start=0, end=-1, desc=False):
        """
        Get a range of values from a Redis sorted set.
        """
        if desc:
            return self.redis.zrevrange(key, start, end)
        return self.redis.zrange(key, start, end)
    
    def publish(self, channel, message):
        """
        Publish a message to a Redis channel.
        """
        if isinstance(message, (dict, list)):
            message = json.dumps(message)
        
        return self.redis.publish(channel, message)
    
    def subscribe(self, channel):
        """
        Subscribe to a Redis channel.
        """
        pubsub = self.redis.pubsub()
        pubsub.subscribe(channel)
        return pubsub
    
    def get_lock(self, name, timeout=None, blocking=True, blocking_timeout=None):
        """
        Get a Redis lock.
        """
        from redis.lock import Lock
        
        return Lock(
            self.redis,
            name,
            timeout=timeout,
            blocking=blocking,
            blocking_timeout=blocking_timeout
        )


# Cache decorators
def cache_result(timeout=None, key_prefix=''):
    """
    Decorator to cache function results.
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Generate cache key
            key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            result = cache.get(key)
            if result is not None:
                return result
            
            # Call function and cache result
            result = func(*args, **kwargs)
            cache.set(key, result, timeout)
            
            return result
        return wrapper
    return decorator


def invalidate_cache(key_pattern):
    """
    Decorator to invalidate cache after function execution.
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Call function
            result = func(*args, **kwargs)
            
            # Invalidate cache
            redis_client = RedisClient()
            redis_client.clear_cache(key_pattern)
            
            return result
        return wrapper
    return decorator
