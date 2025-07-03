from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import DynamicForm, DynamicField
from .serializers import DynamicFormSerializer, DynamicFieldSerializer

# Create your views here.

class DynamicFormViewSet(viewsets.ModelViewSet):
    queryset = DynamicForm.objects.all().order_by('-created_at')
    serializer_class = DynamicFormSerializer
    permission_classes = [permissions.IsAuthenticated]

class DynamicFieldViewSet(viewsets.ModelViewSet):
    queryset = DynamicField.objects.all().order_by('order')
    serializer_class = DynamicFieldSerializer
    permission_classes = [permissions.IsAuthenticated]
