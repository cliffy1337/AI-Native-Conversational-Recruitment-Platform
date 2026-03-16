from django.shortcuts import render

def home(request):
    return render(request, 'jobs/index.html')

def job_list(request):
    return render(request, 'jobs/job_list.html')

def post_job(request):
    return render(request, 'jobs/post_job.html')

# job list, detail, apply, recruiter dashboard
