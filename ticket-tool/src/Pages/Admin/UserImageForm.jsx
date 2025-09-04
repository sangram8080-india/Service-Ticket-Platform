import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
import api from './api';

const UserImageForm = ({ userId, onSuccess, onCancel }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('name', '');
      formData.append('phone', '');

      await api.put(`/api/users/${userId}/with-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Profile Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Form.Group>

      {preview && (
        <div className="mb-3 text-center">
          <Image src={preview} thumbnail style={{ maxHeight: '200px' }} />
        </div>
      )}

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading || !file}>
          {loading ? (
            <>
              <Spinner as="span" size="sm" animation="border" role="status" />
              <span className="ms-2">Uploading...</span>
            </>
          ) : 'Upload Image'}
        </Button>
      </div>
    </Form>
  );
};

export default UserImageForm;