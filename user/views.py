from django.shortcuts import redirect, render, reverse
from django.core.paginator import Paginator
from user.models import *
from user.forms import FormUser, FormUserProfileInfo
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from urllib.parse import urlencode

from rest_framework import viewsets, permissions



# Create your views here.

def login(request):
    if  request.user.is_authenticated:
        return redirect('home:index')
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)   # user
            return redirect('home:index')
    return redirect('home:index')

def create_account(request):
    pass
        
        
def logout(request):
    if  request.user.is_authenticated:
        return redirect('home:index')
    # form_user = FormUser()
    # form_profile = FormUserProfileInfo()
    logout(request)
    return redirect('home:index')
    