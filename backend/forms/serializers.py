from rest_framework import serializers
from .models import DynamicForm, DynamicField

class DynamicFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicField
        fields = ['id', 'label', 'field_type', 'order', 'required']

class DynamicFormSerializer(serializers.ModelSerializer):
    fields = DynamicFieldSerializer(many=True)

    class Meta:
        model = DynamicForm
        fields = ['id', 'name', 'description', 'created_at', 'fields']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields')
        form = DynamicForm.objects.create(**validated_data)
        for field_data in fields_data:
            DynamicField.objects.create(form=form, **field_data)
        return form

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', None)
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        if fields_data is not None:
            instance.fields.all().delete()
            for field_data in fields_data:
                DynamicField.objects.create(form=instance, **field_data)
        return instance 