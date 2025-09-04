import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import api from './api';

const TicketForm = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM', category: '', assignedTo: '' });
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) setFormData(initialData);

    const fetchData = async () => {
      try {
        const [usersRes, categoriesRes] = await Promise.all([api.get('/users/all'), api.get('/categories/all')]);
        setUsers(usersRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Failed to load form data');
        console.error(err);
      }
    };
    fetchData();
  }, [initialData]);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (initialData) await api.put(`/tickets/update/${initialData.id}`, formData);
      else await api.post('/tickets/create', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save ticket');
      console.error(err);
    } finally { setLoading(false); }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control name="title" value={formData.title} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} required />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Assign To</Form.Label>
        <Form.Select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
          <option value="">Unassigned</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
        </Form.Select>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="outline-secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <><Spinner as="span" size="sm" animation="border" /> Saving...</> : initialData ? 'Update Ticket' : 'Create Ticket'}
        </Button>
      </div>
    </Form>
  );
};

export default TicketForm;
