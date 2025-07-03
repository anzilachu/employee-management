from rest_framework.routers import DefaultRouter
from .views import DynamicFormViewSet, DynamicFieldViewSet

router = DefaultRouter()
router.register(r'forms', DynamicFormViewSet, basename='dynamicform')
router.register(r'fields', DynamicFieldViewSet, basename='dynamicfield')

urlpatterns = router.urls 