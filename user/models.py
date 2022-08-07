from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from datetime import datetime
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class UserProfileInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT)
    portfolio = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='users/', default='users/no_avatar.png')
    phone = models.CharField(max_length=264, blank= False)
    
    def __str__(self):
        return self.user.username
