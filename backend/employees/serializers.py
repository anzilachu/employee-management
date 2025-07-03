from rest_framework import serializers
from .models import Employee
from forms.models import DynamicForm

class EmployeeSerializer(serializers.ModelSerializer):
    form_name = serializers.CharField(source='form.name', read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'form', 'form_name', 'data', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] 