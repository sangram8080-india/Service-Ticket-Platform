// AddressModal.js
import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';

const AddressModal = ({ show, handleClose, location, loading }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaMapMarkerAlt className="me-2 text-primary" />
          Location Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading address...</p>
          </div>
        ) : (
          location && (
            <>
              <h6 className="fw-bold">{location.employeeName}</h6>
              <p className="text-muted">ID: {location.employeeId}</p>
              <p>
                <strong>Coordinates:</strong><br />
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
              <p>
                <strong>Address:</strong><br />
                {location.address || 'Address not available'}
              </p>
              <p>
                <strong>Last Updated:</strong><br />
                {new Date(location.updatedAt).toLocaleString()}
              </p>
            </>
          )
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal;