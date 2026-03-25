{% extends "base_accounts.html" %}
{% load static %}

{% block title %}Profile | Zizo Jobs{% endblock %}

{% block accounts_content %}
<div class="profile-container">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Profile Card -->
        <div class="lg:col-span-1">
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-picture-wrapper">
                        {% if user.profile_picture %}
                            <img id="profile-picture-img" 
                                 src="{{ user.profile_picture.url }}" 
                                 alt="{{ user.username }}" 
                                 class="profile-picture">
                        {% else %}
                            <img id="profile-picture-img" 
                                 src="{% static 'images/default-avatar.png' %}" 
                                 alt="Default Avatar" 
                                 class="profile-picture">
                        {% endif %}
                        
                        <label for="picture-upload" class="upload-overlay">
                            <i class="fas fa-camera"></i>
                        </label>
                        <input type="file" 
                               id="picture-upload" 
                               class="hidden" 
                               accept="image/jpeg,image/png,image/gif,image/webp">
                        
                        {% if user.profile_picture %}
                            <div class="delete-photo-btn" id="delete-picture">
                                <i class="fas fa-trash"></i>
                            </div>
                        {% else %}
                            <div class="delete-photo-btn" id="delete-picture" style="display: none;">
                                <i class="fas fa-trash"></i>
                            </div>
                        {% endif %}
                        
                        <div id="upload-progress" class="upload-progress">
                            <div class="progress-bar-custom"></div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-info">
                    <h2 class="profile-name">{{ user.get_full_name|default:user.username }}</h2>
                    <p class="profile-email">{{ user.email }}</p>
                    
                    <span class="profile-badge {% if user.is_recruiter %}badge-recruiter{% else %}badge-jobseeker{% endif %}">
                        <i class="fas {% if user.is_recruiter %}fa-briefcase{% else %}fa-user-graduate{% endif %}"></i>
                        {{ user.get_user_type_display }}
                    </span>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-value">{{ user.created_at|date:"M Y" }}</div>
                        <div class="stat-label">Member Since</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">
                            {% if user.is_recruiter %}
                                {{ total_jobs_posted|default:"0" }}
                            {% else %}
                                {{ total_applications|default:"0" }}
                            {% endif %}
                        </div>
                        <div class="stat-label">
                            {% if user.is_recruiter %}Jobs Posted{% else %}Applications{% endif %}
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">
                            {% if user.onboarding_completed %}
                                ✓
                            {% else %}
                                ⏳
                            {% endif %}
                        </div>
                        <div class="stat-label">Onboarding</div>
                    </div>
                </div>
                
                <!-- Display Phone -->
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        <i class="fas fa-phone-alt mr-2"></i> 
                        {{ user.phone|default:"No phone number provided" }}
                    </p>
                </div>
                
                <!-- Display Company Name for Recruiters -->
                {% if user.is_recruiter %}
                <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        <i class="fas fa-building mr-2"></i> 
                        {{ user.company_name|default:"No company name provided" }}
                    </p>
                </div>
                {% endif %}
                
                <!-- Resume Section -->
                <div class="p-6">
                    <div class="resume-card">
                        <i class="fas fa-file-alt text-indigo-600 dark:text-indigo-400"></i>
                        <strong class="ml-2">Resume/CV</strong>
                        {% if user.resume %}
                            <a href="{{ user.resume.url }}" target="_blank" class="block mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                <i class="fas fa-download"></i> View Resume
                            </a>
                        {% else %}
                            <p class="text-sm text-gray-500 mt-2">No resume uploaded</p>
                        {% endif %}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Right Column - Profile Information -->
        <div class="lg:col-span-2">
            <!-- View Mode -->
            <div id="view-mode" class="edit-form-container">
                <div class="form-header">
                    <div class="flex justify-between items-center">
                        <h3>
                            <i class="fas fa-user-circle mr-2"></i>
                            Profile Information
                        </h3>
                        <button id="edit-profile-btn" class="btn-primary" style="padding: 0.5rem 1rem;">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                    </div>
                </div>
                <div class="form-body">
                    <!-- Display all user information -->
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                                <p class="font-medium">{{ user.get_full_name|default:"Not set" }}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Username</label>
                                <p class="font-medium">{{ user.username }}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Email</label>
                                <p class="font-medium">{{ user.email }}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Phone</label>
                                <p class="font-medium">{{ user.phone|default:"Not provided" }}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">User Type</label>
                                <p class="font-medium">{{ user.get_user_type_display }}</p>
                            </div>
                            <div>
                                <label class="text-sm text-gray-500 dark:text-gray-400">Member Since</label>
                                <p class="font-medium">{{ user.created_at|date:"F j, Y" }}</p>
                            </div>
                            {% if user.is_recruiter %}
                            <div class="col-span-2">
                                <label class="text-sm text-gray-500 dark:text-gray-400">Company Name</label>
                                <p class="font-medium">{{ user.company_name|default:"Not provided" }}</p>
                            </div>
                            {% endif %}
                            <div class="col-span-2">
                                <label class="text-sm text-gray-500 dark:text-gray-400">Onboarding Status</label>
                                <p class="font-medium">
                                    {% if user.onboarding_completed %}
                                        <span class="text-green-600">✓ Completed</span>
                                    {% else %}
                                        <span class="text-yellow-600">⏳ Pending</span>
                                    {% endif %}
                                </p>
                            </div>
                            <div class="col-span-2">
                                <label class="text-sm text-gray-500 dark:text-gray-400">Resume/CV</label>
                                {% if user.resume %}
                                    <p class="font-medium">
                                        <a href="{{ user.resume.url }}" target="_blank" class="text-indigo-600 hover:underline">
                                            <i class="fas fa-file-pdf"></i> View Resume
                                        </a>
                                    </p>
                                {% else %}
                                    <p class="font-medium text-gray-500">No resume uploaded</p>
                                {% endif %}
                            </div>
                        </div>
                        
                        <!-- Prompts for missing information -->
                        {% if user.is_job_seeker and not user.resume %}
                        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-4">
                            <div class="flex">
                                <i class="fas fa-file-upload text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3"></i>
                                <div class="text-sm text-yellow-800 dark:text-yellow-300">
                                    <strong>Resume not uploaded yet.</strong> 
                                    <a href="#" class="font-medium underline">Upload your resume</a> to increase your chances of getting hired!
                                </div>
                            </div>
                        </div>
                        {% endif %}
                        
                        {% if user.is_recruiter and not user.company_name %}
                        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-4">
                            <div class="flex">
                                <i class="fas fa-building text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3"></i>
                                <div class="text-sm text-yellow-800 dark:text-yellow-300">
                                    <strong>Company name not set.</strong> 
                                    <a href="#" class="font-medium underline">Add your company name</a> to attract more candidates.
                                </div>
                            </div>
                        </div>
                        {% endif %}
                        
                        {% if not user.onboarding_completed %}
                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
                            <div class="flex">
                                <i class="fas fa-rocket text-blue-600 dark:text-blue-400 mt-0.5 mr-3"></i>
                                <div class="text-sm text-blue-800 dark:text-blue-300">
                                    Complete your onboarding to unlock all features!
                                    <a href="#" class="font-medium underline">Complete Onboarding</a>
                                </div>
                            </div>
                        </div>
                        {% endif %}
                    </div>
                </div>
            </div>
            
            <!-- Edit Mode (Hidden by default) -->
            <div id="edit-mode" class="edit-form-container" style="display: none;">
                <div class="form-header">
                    <div class="flex justify-between items-center">
                        <h3>
                            <i class="fas fa-user-edit mr-2"></i>
                            Edit Profile Information
                        </h3>
                        <button id="cancel-edit-btn" class="btn-secondary" style="padding: 0.5rem 1rem;">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
                <div class="form-body">
                    <form method="post" id="profile-form">
                        {% csrf_token %}
                        
                        <div class="form-group">
                            <label for="id_first_name" class="form-label">First Name</label>
                            <input type="text" 
                                   name="first_name" 
                                   id="id_first_name" 
                                   class="form-control"
                                   value="{{ user.first_name|default:'' }}">
                        </div>
                        
                        <div class="form-group">
                            <label for="id_last_name" class="form-label">Last Name</label>
                            <input type="text" 
                                   name="last_name" 
                                   id="id_last_name" 
                                   class="form-control"
                                   value="{{ user.last_name|default:'' }}">
                        </div>
                        
                        <div class="form-group">
                            <label for="id_username" class="form-label">Username</label>
                            <input type="text" 
                                   name="username" 
                                   id="id_username" 
                                   class="form-control"
                                   value="{{ user.username }}"
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="id_phone" class="form-label">Phone Number</label>
                            <input type="tel" 
                                   name="phone" 
                                   id="id_phone" 
                                   class="form-control"
                                   value="{{ user.phone|default:'' }}"
                                   placeholder="+1 234 567 8900">
                        </div>
                        
                        {% if user.is_recruiter %}
                        <div class="form-group">
                            <label for="id_company_name" class="form-label">Company Name</label>
                            <input type="text" 
                                   name="company_name" 
                                   id="id_company_name" 
                                   class="form-control"
                                   value="{{ user.company_name|default:'' }}"
                                   required>
                            <small class="text-gray-500">Required for recruiters</small>
                        </div>
                        {% endif %}
                        
                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                            <div class="flex">
                                <i class="fas fa-info-circle text-blue-600 dark:text-blue-400 mt-0.5 mr-3"></i>
                                <div class="text-sm text-blue-800 dark:text-blue-300">
                                    <strong>Email:</strong> {{ user.email }} (cannot be changed)
                                    <br>
                                    <strong>User Type:</strong> {{ user.get_user_type_display }} (cannot be changed)
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex gap-3">
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Account Security Card -->
            <div class="edit-form-container mt-6">
                <div class="form-header">
                    <h3>
                        <i class="fas fa-shield-alt mr-2"></i>
                        Account Security
                    </h3>
                </div>
                <div class="form-body">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="{% url 'account_change_password' %}" class="btn-secondary text-center">
                            <i class="fas fa-key mr-2"></i>
                            Change Password
                        </a>
                        <a href="{% url 'account_email' %}" class="btn-secondary text-center">
                            <i class="fas fa-envelope mr-2"></i>
                            Email Settings
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Toggle between view and edit modes
const viewMode = document.getElementById('view-mode');
const editMode = document.getElementById('edit-mode');
const editBtn = document.getElementById('edit-profile-btn');
const cancelBtn = document.getElementById('cancel-edit-btn');

if (editBtn) {
    editBtn.addEventListener('click', () => {
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        editMode.style.display = 'none';
        viewMode.style.display = 'block';
    });
}

// Profile picture upload
document.addEventListener('DOMContentLoaded', function() {
    const pictureInput = document.getElementById('picture-upload');
    const profilePictureImg = document.getElementById('profile-picture-img');
    const deleteBtn = document.getElementById('delete-picture');
    const uploadProgress = document.getElementById('upload-progress');
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
    
    if (pictureInput) {
        pictureInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const formData = new FormData();
            formData.append('profile_picture', file);
            
            if (uploadProgress) uploadProgress.style.display = 'block';
            
            try {
                const response = await fetch("{% url 'accounts:upload_profile_picture' %}", {
                    method: 'POST',
                    headers: { 'X-CSRFToken': csrfToken ? csrfToken.value : '' },
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    profilePictureImg.src = result.url + '?t=' + Date.now();
                    if (deleteBtn) deleteBtn.style.display = 'flex';
                } else {
                    alert('Upload failed: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('An error occurred while uploading');
            } finally {
                if (uploadProgress) uploadProgress.style.display = 'none';
                pictureInput.value = '';
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async function() {
            if (!confirm('Delete profile picture?')) return;
            
            try {
                const response = await fetch("{% url 'accounts:delete_profile_picture' %}", {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': csrfToken ? csrfToken.value : '' }
                });
                
                if (response.ok) {
                    profilePictureImg.src = "{% static 'images/default-avatar.png' %}?t=" + Date.now();
                    deleteBtn.style.display = 'none';
                } else {
                    alert('Delete failed');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('An error occurred while deleting');
            }
        });
    }
});
</script>
{% endblock %}