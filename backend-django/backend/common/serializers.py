"""
Common serializers for the Fashion Hub project.
"""

from rest_framework import serializers


class TranslatedFieldSerializer(serializers.Serializer):
    """
    A serializer for translated fields that handles both English and Arabic content.
    """
    name_en = serializers.CharField(max_length=255)
    name_ar = serializers.CharField(max_length=255)
    description_en = serializers.CharField(required=False, allow_blank=True)
    description_ar = serializers.CharField(required=False, allow_blank=True)


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)
