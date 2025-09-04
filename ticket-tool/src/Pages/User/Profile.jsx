import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isOnline) {
        showMessage("You are offline. Please check your connection.", "error");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // 10 second timeout
        });
        
        if (res.data && res.data.status === "success") {
          const userData = res.data.data;
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
          setPreviewImage(userData.profileImageUrl || null);
        } else {
          showMessage("Failed to load profile data", "error");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        handleApiError(err, "load profile data");
      } finally {
        setLoading(false);
      }
    };
    
    if (userId && token) {
      fetchProfile();
    } else {
      setLoading(false);
      showMessage("Please log in to view your profile", "error");
    }
  }, [userId, token, isOnline]);

  // Handle API errors
  const handleApiError = (err, action) => {
    if (err.code === 'ECONNABORTED') {
      showMessage("Request timeout. Please try again.", "error");
    } else if (err.response?.status === 400) {
      showMessage("Invalid data. Please check your inputs.", "error");
    } else if (err.response?.status === 401) {
      showMessage("Session expired. Please log in again.", "error");
      setTimeout(() => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 2000);
    } else if (err.response?.status === 403) {
      showMessage("Access denied. You don't have permission.", "error");
    } else if (err.response?.status === 404) {
      showMessage("Resource not found.", "error");
    } else if (err.response?.status === 500) {
      if (err.response.data?.includes("JPA transaction")) {
        showMessage("Database error. Please try again with different data.", "error");
      } else {
        showMessage("Server error. Please try again later.", "error");
      }
    } else if (err.message === 'Network Error') {
      showMessage("Network error. Please check your connection.", "error");
    } else {
      showMessage(`Failed to ${action}. Please try again.`, "error");
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showMessage("Please select an image file (JPEG, PNG, etc.)", "error");
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showMessage("Image size should be less than 2MB", "error");
        return;
      }
      
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // Validate profile data
  const validateProfile = () => {
    const errors = {};
    
    if (!profile.name || profile.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }
    
    if (profile.name.length > 50) {
      errors.name = "Name must be less than 50 characters";
    }
    
    if (profile.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profile.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (profile.phone && profile.phone.length > 20) {
      errors.phone = "Phone number must be less than 20 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password change
  const validatePassword = () => {
    const errors = {};
    
    if (!profile.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!profile.newPassword || profile.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters long";
    }
    
    if (profile.newPassword.length > 100) {
      errors.newPassword = "Password is too long";
    }
    
    if (profile.newPassword !== profile.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save profile
  const handleSave = async () => {
    if (!isOnline) {
      showMessage("You are offline. Please check your connection.", "error");
      return;
    }

    if (!validateProfile()) return;
    
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Create the user object with trimmed values
      const userData = {
        name: profile.name.trim(),
        phone: profile.phone ? profile.phone.trim() : ""
      };
      
      // Append the user data as a JSON string
      formData.append("user", new Blob([JSON.stringify(userData)], {
        type: "application/json"
      }));
      
      // Append the image if present
      if (profileImageFile) {
        formData.append("image", profileImageFile);
      }

      const response = await axios.put(`http://localhost:8080/api/users/${userId}/with-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000
      });

      if (response.data.status === "success") {
        showMessage("Profile updated successfully!", "success");
        // Clear the image file after successful upload
        setProfileImageFile(null);
      } else {
        showMessage(response.data.message || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      handleApiError(err, "update profile");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    if (!isOnline) {
      showMessage("You are offline. Please check your connection.", "error");
      return;
    }

    if (!validatePassword()) return;
    
    setChangingPassword(true);
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${userId}/password`, {
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000
      });

      if (response.data.status === "success") {
        showMessage("Password changed successfully!", "success");
        setProfile(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        showMessage(response.data.message || "Failed to change password", "error");
      }
    } catch (err) {
      console.error("Password change failed:", err);
      handleApiError(err, "change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!isOnline) {
      showMessage("You are offline. Please check your connection.", "error");
      return;
    }

    if (deleteConfirm !== "DELETE") {
      showMessage("Please type DELETE to confirm account deletion", "error");
      return;
    }
    
    try {
      const response = await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000
      });

      if (response.data.status === "success") {
        showMessage("Account deleted successfully", "success");
        setTimeout(() => {
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }, 2000);
      } else {
        showMessage(response.data.message || "Failed to delete account", "error");
      }
    } catch (err) {
      console.error("Account deletion failed:", err);
      handleApiError(err, "delete account");
      setShowDeleteModal(false);
      setDeleteConfirm("");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userId || !token) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger text-center">
              Please log in to view your profile
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Network Status Indicator */}
          {!isOnline && (
            <div className="alert alert-warning alert-dismissible fade show mb-4">
              <i className="bi bi-wifi-off me-2"></i>
              You are currently offline. Some features may not be available.
            </div>
          )}

          {message.text && (
            <div className={`alert ${message.type === "error" ? "alert-danger" : "alert-success"} alert-dismissible fade show mb-4`}>
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({ text: "", type: "" })}></button>
            </div>
          )}
          
          <div className="card shadow">
            <div className="card-header bg-primary text-white py-3">
              <h3 className="card-title mb-0">Profile Settings</h3>
              <p className="card-text opacity-75 mb-0">Manage your account information and preferences</p>
            </div>
            
            <div className="card-body p-4">
              {/* Profile Image Section */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={previewImage || "/default-avatar.png"}
                    alt="Profile"
                    className="rounded-circle shadow"
                    style={{ width: "140px", height: "140px", objectFit: "cover" }}
                  />
                  <label 
                    htmlFor="file-upload"
                    className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle cursor-pointer shadow"
                    style={{ cursor: "pointer" }}
                    title="Change profile photo"
                  >
                    <i className="bi bi-camera-fill"></i>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="d-none"
                    />
                  </label>
                </div>
                <p className="text-muted mt-2">Click on the camera icon to change your profile photo (Max 2MB)</p>
              </div>

              {/* Personal Information Section */}
              <div className="mb-4">
                <h5 className="border-bottom pb-2 mb-3">Personal Information</h5>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter your full name"
                      maxLength="50"
                    />
                    {validationErrors.name && (
                      <div className="invalid-feedback">{validationErrors.name}</div>
                    )}
                    <div className="form-text">{profile.name.length}/50 characters</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      className="form-control"
                      disabled
                    />
                    <div className="form-text">Email cannot be changed</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
                    placeholder="Enter your phone number"
                    maxLength="20"
                  />
                  {validationErrors.phone && (
                    <div className="invalid-feedback">{validationErrors.phone}</div>
                  )}
                  <div className="form-text">{profile.phone.length}/20 characters</div>
                </div>
                
                <div className="text-end">
                  <button
                    onClick={handleSave}
                    disabled={saving || !isOnline}
                    className={`btn btn-primary px-4 ${saving ? "disabled" : ""}`}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="mb-4">
                <h5 className="border-bottom pb-2 mb-3">Change Password</h5>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="currentPassword" className="form-label fw-semibold">Current Password *</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={profile.currentPassword}
                      onChange={handleChange}
                      className={`form-control ${validationErrors.currentPassword ? 'is-invalid' : ''}`}
                      placeholder="Enter current password"
                    />
                    {validationErrors.currentPassword && (
                      <div className="invalid-feedback">{validationErrors.currentPassword}</div>
                    )}
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="newPassword" className="form-label fw-semibold">New Password *</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={profile.newPassword}
                      onChange={handleChange}
                      className={`form-control ${validationErrors.newPassword ? 'is-invalid' : ''}`}
                      placeholder="Enter new password"
                    />
                    {validationErrors.newPassword && (
                      <div className="invalid-feedback">{validationErrors.newPassword}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm New Password *</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={profile.confirmPassword}
                      onChange={handleChange}
                      className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Confirm new password"
                    />
                    {validationErrors.confirmPassword && (
                      <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                    )}
                  </div>
                </div>
                
                <div className="text-end">
                  <button
                    onClick={handlePasswordChange}
                    disabled={changingPassword || !isOnline}
                    className={`btn btn-outline-primary px-4 ${changingPassword ? "disabled" : ""}`}
                  >
                    {changingPassword ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : "Update Password"}
                  </button>
                </div>
              </div>

              {/* Danger Zone Section */}
              <div className="border-top pt-4">
                <h5 className="text-danger mb-3">Danger Zone</h5>
                <p className="text-muted mb-3">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={!isOnline}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title text-danger">Delete Account</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-danger mb-3">
                  <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and remove all your data.
                </p>
                <p>Please type <strong>DELETE</strong> to confirm:</p>
                <input
                  type="text"
                  className="form-control"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE to confirm"
                />
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== "DELETE" || !isOnline}
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;