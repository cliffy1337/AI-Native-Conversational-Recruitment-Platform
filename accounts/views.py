from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
import json

from .models import User
from .forms import ProfileForm, ProfilePictureForm

@login_required
def dashboard(request):
    """User dashboard view"""
    # You can add counts from other apps here
    context = {
        'user': request.user,
        'is_recruiter': request.user.is_recruiter,
        'is_job_seeker': request.user.is_job_seeker,
        'onboarding_completed': request.user.onboarding_completed,
        # Add these counts from your applications and jobs apps
        'total_applications': 0,  # Replace with actual count
        'total_jobs_posted': 0,    # Replace with actual count
    }
    return render(request, 'accounts/dashboard.html', context)

@login_required
def profile(request):
    """Profile view with edit functionality"""
    user = request.user
    
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=user)
        if form.is_valid():
            try:
                form.save()
                messages.success(request, 'Profile updated successfully.')
                return redirect('accounts:profile')
            except ValidationError as e:
                messages.error(request, str(e))
    else:
        form = ProfileForm(instance=user)
    
    context = {
        'form': form,
        'user': user,
        'profile_picture_form': ProfilePictureForm(instance=user),
        'is_recruiter': user.is_recruiter,
        'is_job_seeker': user.is_job_seeker,
        'onboarding_completed': user.onboarding_completed,
    }
    return render(request, 'accounts/profile.html', context)

@login_required
@csrf_exempt
@require_http_methods(["POST"])
def upload_profile_picture(request):
    """Handle profile picture upload via AJAX"""
    try:
        user = request.user
        form = ProfilePictureForm(request.POST, request.FILES, instance=user)
        
        if form.is_valid():
            # Save the new picture
            form.save()
            
            return JsonResponse({
                'success': True,
                'url': user.profile_picture.url,
                'message': 'Profile picture updated successfully'
            })
        else:
            # Collect all errors
            errors = {}
            for field, field_errors in form.errors.items():
                errors[field] = [str(error) for error in field_errors]
            
            return JsonResponse({
                'success': False,
                'errors': errors
            }, status=400)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@login_required
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_profile_picture(request):
    """Delete profile picture"""
    try:
        user = request.user
        
        if not user.profile_picture:
            return JsonResponse({
                'success': False,
                'error': 'No profile picture to delete'
            }, status=400)
        
        # Delete the picture using the model method
        user.delete_profile_picture()
        
        return JsonResponse({
            'success': True,
            'message': 'Profile picture deleted successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)