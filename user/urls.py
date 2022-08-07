from django.urls import path
from user import views


app_name = 'user'
urlpatterns = [
    path('login/', views.create_account, name='login'),
    path('logout/', views.logout, name='logout'),
    
]
