// import React, { useState } from "react";
// import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../Styles/LoginPage.css";
// import axios from "axios";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const API_URL = "https://perpetual-liberation-service-ticket.up.railway.app/api/forgot-password"; // api for the forgot password

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email) {
//       setError("Please enter your registered email address.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await axios.post(
//         API_URL,
//         { email },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       setSubmitted(true);
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-page-container d-flex align-items-center justify-content-center min-vh-100 bg-white">
//       <div style={{ maxWidth: "400px", width: "100%" }}>
//         <Card className="login-card">
//           <Card.Body className="p-4">
//             <div className="text-center mb-4">
//               <h2 className="fw-bold mb-2">Forgot Password</h2>
//               <p className="text-muted">
//                 Enter your registered email address.
//               </p>
//             </div>

//             {submitted ? (
//               <Alert variant="success" className="text-center">
//                 If this email exists in our system, you'll receive password reset instructions soon.
//               </Alert>
//             ) : (
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Email Address</Form.Label>
//                   <Form.Control
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     disabled={isLoading}
//                     className="login-input"
//                   />
//                 </Form.Group>

//                 {error && (
//                   <Alert variant="danger" className="text-center py-2 mb-3">
//                     <small>{error}</small>
//                   </Alert>
//                 )}

//                 <Button
//                   variant="primary"
//                   type="submit"
//                   className="w-100 py-2 mb-3 login-btn"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <Spinner as="span" animation="border" size="sm" role="status" />
//                   ) : (
//                     "Send Reset Link"
//                   )}
//                 </Button>
//                 <div className="text-center">
//                   <a href="/login" className="text-primary small">Back to Login</a>
//                 </div>
//               </Form>
//             )}
//           </Card.Body>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/LoginPage.css";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://perpetual-liberation-service-ticket.up.railway.app/api/forgot-password"; // api for the forgot password

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        API_URL,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="d-flex justify-content-center"
        >
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: "450px", width: "100%" }}>
            {/* Card Header with Gradient */}
            <div
              className="py-4 text-center text-white"
              style={{
                background: "linear-gradient(135deg, #F7941D 0%, #FF6B00 100%)"
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="icon-container mb-3"
              >
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(255, 255, 255, 0.2)",
                    fontSize: "1.5rem"
                  }}
                >
                  <FaEnvelope />
                </div>
              </motion.div>
              <h2 className="fw-bold mb-2">Forgot Password</h2>
              <p className="mb-0 opacity-90">Enter your registered email address</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert
                    variant="success"
                    className="text-center border-0 rounded-3 mb-4"
                    style={{
                      background: "rgba(72, 187, 120, 0.1)",
                      color: "#166534",
                      border: "1px solid rgba(72, 187, 120, 0.2)"
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{
                          width: "30px",
                          height: "30px",
                          background: "rgba(72, 187, 120, 0.2)",
                          color: "#166534"
                        }}
                      >
                        <FaPaperPlane size={14} />
                      </div>
                      <h6 className="mb-0 fw-bold">Email Sent Successfully</h6>
                    </div>
                    <p className="mb-0 small">
                      If this email exists in our system, you'll receive password reset instructions soon.
                    </p>
                  </Alert>

                  <div className="text-center mt-4">
                    <Link
                      to="/login"
                      className="btn btn-outline-primary d-inline-flex align-items-center"
                      style={{
                        borderRadius: "8px",
                        padding: "0.5rem 1.5rem",
                        fontSize: "0.9rem"
                      }}
                    >
                      <FaArrowLeft className="me-2" size={12} />
                      Back to Login
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark mb-2">
                        Email Address
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          className="py-3 px-4 border-0 rounded-3"
                          style={{
                            background: "#f8f9fa",
                            fontSize: "0.95rem",
                            transition: "all 0.2s ease"
                          }}
                          onFocus={(e) => {
                            e.target.style.background = "#ffffff";
                            e.target.style.boxShadow = "0 0 0 3px rgba(247, 148, 29, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.background = "#f8f9fa";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                        <FaEnvelope
                          className="position-absolute"
                          style={{
                            top: "50%",
                            right: "1rem",
                            transform: "translateY(-50%)",
                            color: "#A0AEC0"
                          }}
                        />
                      </div>
                    </Form.Group>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Alert
                          variant="danger"
                          className="rounded-3 border-0 d-flex align-items-center py-2 mb-4"
                          style={{
                            background: "rgba(220, 53, 69, 0.1)",
                            color: "#E53E3E",
                            border: "1px solid rgba(220, 53, 69, 0.2)"
                          }}
                        >
                          <i className="bi bi-exclamation-circle-fill me-2"></i>
                          <small className="fw-medium">{error}</small>
                        </Alert>
                      </motion.div>
                    )}

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 py-3 rounded-3 border-0 fw-semibold"
                      disabled={isLoading}
                      style={{
                        background: "linear-gradient(135deg, #F7941D 0%, #FF6B00 100%)",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(247, 148, 29, 0.3)"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(247, 148, 29, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 12px rgba(247, 148, 29, 0.3)";
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            className="me-2"
                          />
                          Sending Reset Link...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="me-2" />
                          Send Reset Link
                        </>
                      )}
                    </Button>

                    <div className="text-center mt-4 pt-3 border-top">
                      <Link
                        to="/login"
                        className="text-decoration-none d-inline-flex align-items-center"
                        style={{
                          color: "#F7941D",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          transition: "color 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#FF6B00"}
                        onMouseLeave={(e) => e.target.style.color = "#F7941D"}
                      >
                        <FaArrowLeft className="me-2" size={12} />
                        Back to Login
                      </Link>
                    </div>
                  </Form>
                </motion.div>
              )}
            </Card.Body>
          </Card>
        </motion.div>

        {/* Footer */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-4"
        >
          <p className="text-muted small">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@servicehub.com"
              className="text-decoration-none"
              style={{ color: "#F7941D" }}
            >
              support@servicehub.com
            </a>
          </p>
        </motion.div> */}
      </Container>

      <style>{`
        .bg-light {
          background: linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%) !important;
        }
        
        .icon-container {
          transition: transform 0.3s ease;
        }
        
        .icon-container:hover {
          transform: scale(1.1);
        }
        
        @media (max-width: 576px) {
          .card {
            margin: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          }
          
          .card-body {
            padding: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;