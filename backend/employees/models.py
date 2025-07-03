from django.db import models
from forms.models import DynamicForm

# Create your models here.

class Employee(models.Model):
    form = models.ForeignKey(DynamicForm, related_name='employees', on_delete=models.CASCADE)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Employee {self.id} ({self.form.name})"
