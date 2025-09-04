import React, { useState } from 'react';
import { Form, Button, Modal, Alert, Spinner, Row, Col } from 'react-bootstrap';
import api from './api';

const UserForm = ({ mode, initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'USER',
    active: true,
    password: '',
    ...initialData
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles] = useState(['ADMIN', 'AGENT', 'USER']);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'edit') {
        const updateData = {
          name: formData.name,
          phone: formData.phoneNumber
        };
        await api.put(`/api/users/${formData.id}`, updateData);
      } else {
        await api.post('/api/users/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Form.Group as={Col} controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={mode === 'edit'}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        {mode === 'create' && (
          <Form.Group as={Col} controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={mode === 'create'}
            />
          </Form.Group>
        )}

        <Form.Group as={Col} controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="role">
          <Form.Label>Role</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={mode === 'edit'}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} controlId="active" className="d-flex align-items-end">
          <Form.Check
            type="switch"
            id="active-switch"
            label="Active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
        </Form.Group>
      </Row>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" size="sm" animation="border" role="status" />
              <span className="ms-2">Saving...</span>
            </>
          ) : (
            mode === 'edit' ? 'Update User' : 'Create User'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;