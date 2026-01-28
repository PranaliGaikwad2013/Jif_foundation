import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Profile</h2>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px', fontSize: '48px' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h4 className="card-title">{user?.name}</h4>
              <p className="text-muted">{user?.email}</p>
              <span className="badge bg-secondary">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Profile Information</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Full Name:</strong>
                </div>
                <div className="col-sm-8">
                  {user?.name}
                </div>
              </div>
              <hr />
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Email Address:</strong>
                </div>
                <div className="col-sm-8">
                  {user?.email}
                </div>
              </div>
              <hr />
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Role:</strong>
                </div>
                <div className="col-sm-8">
                  <span className="badge bg-secondary">{user?.role}</span>
                </div>
              </div>
              <hr />
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Account Status:</strong>
                </div>
                <div className="col-sm-8">
                  <span className="badge bg-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
