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
    return render(request, "home/login.html")

def create_account(request):
    if  request.user.is_authenticated:
        return redirect('home:index')
    form_user = FormUser()
    form_profile = FormUserProfileInfo()
    result_signup=""
    if request.method == "POST":
        form_user = FormUser(request.POST)
        if form_user.is_valid():
            print("haha")
            if form_user.cleaned_data['password'] == form_user.cleaned_data['confirm_password']:
                
                user = form_user.save()
                user.set_password(user.password)
                user.save()

                profile = form_profile.save(commit=False)
                profile.user = user
                profile.save()
                
                return redirect("home:index")
                
    return render(request, "home/login.html",{
        'form_user': form_user,
        'form_profile': form_profile,
        'result_signup': result_signup,
    })

        
def logout(request):
    if  request.user.is_authenticated:
        return redirect('home:index')

    logout(request)
    return redirect('home:index')
    