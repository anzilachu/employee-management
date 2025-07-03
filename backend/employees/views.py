from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from .models import Employee
from .serializers import EmployeeSerializer
from django.db.models import Q

# Create your views here.

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('-created_at')
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['data']  # Allows searching in JSON data (may need custom filter for advanced search)

    def get_queryset(self):
        queryset = super().get_queryset()
        form_id = self.request.query_params.get('form')
        if form_id:
            queryset = queryset.filter(form_id=form_id)
        # Advanced filtering by dynamic field label
        for key, value in self.request.query_params.items():
            if key.startswith('field_'):
                label = key[6:]
                # JSONField lookup: data__label
                queryset = queryset.filter(**{f"data__{label}": value})
        return queryset
