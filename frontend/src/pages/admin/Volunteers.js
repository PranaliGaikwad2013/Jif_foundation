import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { volunteerAPI } from '../../services/api';

const API_URL = 'http://localhost:8000';

const Volunteers = () => {
  const [searchParams] = useSearchParams();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [deletingVolunteer, setDeletingVolunteer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country_code: '+91',
    mobile: '',
    profile_image: null,
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchVolunteers();
    
    // Check for action parameter
    const action = searchParams.get('action');
    if (action === 'add') {
      handleAddNew();
    } else if (action === 'export') {
      handleExport();
    }
  }, [searchParams]);

  const fetchVolunteers = async () => {
    try {
      const response = await volunteerAPI.getAll();
      setVolunteers(response.data.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingVolunteer(null);
    setFormData({
      name: '',
      email: '',
      country_code: '+91',
      mobile: '',
      profile_image: null,
      status: 'active',
    });
    setImagePreview(null);
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    setFormData({
      name: volunteer.name,
      email: volunteer.email,
      country_code: volunteer.country_code,
      mobile: volunteer.mobile,
      profile_image: null,
      status: volunteer.status,
    });
    setImagePreview(volunteer.profile_image ? `${API_URL}/upload/${volunteer.profile_image}` : null);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (volunteer) => {
    setDeletingVolunteer(volunteer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await volunteerAPI.delete(deletingVolunteer.id);
      setVolunteers(volunteers.filter(v => v.id !== deletingVolunteer.id));
      setShowDeleteModal(false);
      setDeletingVolunteer(null);
      showSuccess('Volunteer deleted successfully!');
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Failed to delete volunteer');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      if (editingVolunteer) {
        await volunteerAPI.update(editingVolunteer.id, formData);
        showSuccess('Volunteer updated successfully!');
      } else {
        await volunteerAPI.create(formData);
        showSuccess('Volunteer created successfully!');
      }
      
      setShowModal(false);
      fetchVolunteers();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'An error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await volunteerAPI.export();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'volunteers.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting volunteers:', error);
      alert('Failed to export volunteers');
    }
  };

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+7', country: 'Russia' },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      {/* Header */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Volunteers Management</h5>
          <div>
            <button className="btn btn-success me-2" onClick={handleAddNew}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg me-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
              </svg>
              Add Volunteer
            </button>
            <button className="btn btn-info" onClick={handleExport}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download me-1" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Volunteers Table */}
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <p className="text-muted mb-0">No volunteers found</p>
                    </td>
                  </tr>
                ) : (
                  volunteers.map((volunteer, index) => (
                    <tr key={volunteer.id}>
                      <td>{index + 1}</td>
                      <td>
                        {volunteer.profile_image ? (
                          <img
                            src={`${API_URL}/upload/${volunteer.profile_image}`}
                            alt={volunteer.name}
                            className="profile-image"
                          />
                        ) : (
                          <div className="profile-image bg-secondary d-flex align-items-center justify-content-center text-white">
                            {volunteer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td>{volunteer.name}</td>
                      <td>{volunteer.email}</td>
                      <td>{volunteer.country_code} {volunteer.mobile}</td>
                      <td>
                        <span className={`badge status-badge ${volunteer.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                          {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary btn-action me-1"
                          onClick={() => handleEdit(volunteer)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                          </svg>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger btn-action"
                          onClick={() => handleDelete(volunteer)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingVolunteer ? 'Edit Volunteer' : 'Add New Volunteer'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Profile Image Preview */}
                  <div className="text-center mb-3">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="profile-image-preview" />
                    ) : (
                      <div className="profile-image-preview bg-secondary d-flex align-items-center justify-content-center text-white mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                  </div>

                  {/* Mobile */}
                  <div className="mb-3">
                    <label className="form-label">Mobile *</label>
                    <div className="input-group">
                      <select
                        className={`form-select ${errors.country_code ? 'is-invalid' : ''}`}
                        name="country_code"
                        value={formData.country_code}
                        onChange={handleInputChange}
                        style={{ maxWidth: '120px' }}
                      >
                        {countryCodes.map((cc) => (
                          <option key={cc.code} value={cc.code}>
                            {cc.code} ({cc.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="Mobile number"
                        required
                      />
                    </div>
                    {errors.mobile && <div className="text-danger small mt-1">{errors.mobile[0]}</div>}
                  </div>

                  {/* Profile Image */}
                  <div className="mb-3">
                    <label htmlFor="profile_image" className="form-label">Profile Image</label>
                    <input
                      type="file"
                      className={`form-control ${errors.profile_image ? 'is-invalid' : ''}`}
                      id="profile_image"
                      name="profile_image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {errors.profile_image && <div className="invalid-feedback">{errors.profile_image[0]}</div>}
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="statusActive"
                          value="active"
                          checked={formData.status === 'active'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="statusActive">Active</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="statusInactive"
                          value="inactive"
                          checked={formData.status === 'inactive'}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="statusInactive">Inactive</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      editingVolunteer ? 'Update' : 'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{deletingVolunteer?.name}</strong>?</p>
                <p className="text-muted small">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteers;
