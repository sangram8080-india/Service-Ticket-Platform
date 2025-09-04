import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

const NewTicket = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "LOW",
    latitude: null,
    longitude: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = user?.id || localStorage.getItem("userId");

      if (!userId) {
        setError("User not authenticated. Please login again.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("Authentication token missing. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/tickets/create/${userId}`,
        form,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("Ticket created successfully:", response.data);
      setSuccess("✅ Ticket created successfully!");
      setTimeout(() => navigate("/user-portal/tickets"), 1500);
    } catch (err) {
      console.error("❌ Ticket creation failed:", err);
      setError(err.response?.data?.message || "Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-0 py-3">
          <h4 className="mb-0 fw-bold">Create New Ticket</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter ticket title"
                value={form.title}
                onChange={handleChange}
                required
                minLength={5}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Describe your issue in detail"
                value={form.description}
                onChange={handleChange}
                required
                minLength={10}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority *</Form.Label>
              <Form.Select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location (Auto-detected)</Form.Label>
              <div className="d-flex gap-3">
                <Form.Control
                  type="text"
                  value={form.latitude ? form.latitude.toFixed(6) : "Not available"}
                  placeholder="Latitude"
                  readOnly
                />
                <Form.Control
                  type="text"
                  value={form.longitude ? form.longitude.toFixed(6) : "Not available"}
                  placeholder="Longitude"
                  readOnly
                />
              </div>
              <Form.Text className="text-muted">
                Location is automatically detected from your device
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading}
                className="px-4"
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Create Ticket"}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate("/user-portal/tickets")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NewTicket;