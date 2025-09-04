import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../Images/hero-image.jpg";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/HomePage.css";
import Footer from "../Components/Footer";

// -----------------------------------------
import CountUp from "react-countup";
import { motion } from "framer-motion";
import CustomNavbar from "../Components/CustomNavbar";
import HomepageChatbot from '../Components/HomepageChatbot';

const metrics = [
  { count: 1000000, duration: 1.2, suffix: "+", label: "Tickets Resolved" },
  { count: 50000, duration: 1.1, suffix: "+", label: "Active Users" },
  { count: 99.9, duration: 1.5, decimals: 1, suffix: "%", label: "Uptime" },
  { count: 4.9, duration: 1.2, decimals: 1, suffix: "★", label: "User Rating" },
];

export default function Home() {
  const orange = "#F7941D";
  
  return (
    <>
      <CustomNavbar />
      <div className="homepage">
        {/* //hero section  */}

        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="mb-4">
                <i className="bi bi-robot display-3 text-purple"></i>
              </div>

              <motion.h1
                className="display-4 fw-bold"
                style={{ overflow: "hidden" }}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.28 } },
                    hidden: {},
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: "spring", duration: 0.7 }}
                  >
                    <span className="text-gradient-orange">Resolve</span>{" "}
                    Smarter.
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: "spring", duration: 0.7 }}
                  >
                    <span className="text-gradient-orange">Track</span> Faster.
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: "spring", duration: 0.7 }}
                  >
                    <span className="text-gradient-orange">Serve</span> Better.
                  </motion.div>
                </motion.div>
              </motion.h1>

              <motion.p
                className="lead mt-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Experience the future of service management with AI-powered
                automation, real-time tracking, and{" "}
                <span className="text-warning">intelligent</span> insights.
              </motion.p>
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <Link
                  to="/SignUp"
                  className="btn bg-gradient-orange btn-lg me-3"
                >
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-outline-dark btn-lg">
                  Login
                </Link>
              </motion.div>
              <motion.div
                className="row mt-5 text-center"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.13 } },
                }}
              >
                {metrics.map((metric) => (
                  <motion.div
                    key={metric.label}
                    className="col-6 col-md-3"
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <h4>
                      <CountUp
                        end={metric.count}
                        duration={metric.duration}
                        decimals={metric.decimals || 0}
                        separator=","
                        suffix={metric.suffix}
                      />
                    </h4>
                    <p className="hero-metric">{metric.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="col-lg-6 text-center">
              <motion.img
                src={heroImage}
                alt="AI Service Management"
                className="hero-img img-fluid rounded shadow"
                style={{ maxHeight: "410px", objectFit: "contain" }}
                initial={{ scale: 0.92, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.9, delay: 0.4 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 12px 48px rgba(168, 85, 247, 0.2)",
                }}
              />
            </div>
          </div>
        </div>

        {/* --------------2nd section------------------------- */}
        {/* Goals Section */}
        <section className="goals-section py-5">
          <Container>
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-dark">Align your goals.</h1>
              <p className="fs-4 text-muted">IMPROVE YOUR ROI.</p>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <div className="goals-card p-4 h-100">
                  <h3 className="fw-bold mb-3">
                    Reduce 60% response time to your ticketing
                  </h3>
                  <p className="text-muted mb-0">
                    Streamline your support process with automated workflows and
                    smart routing.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="goals-card p-4 h-100">
                  <h3 className="fw-bold mb-3">
                    Achieve help desk excellence & create value for customers
                  </h3>
                  <p className="text-muted mb-0">
                    Deliver exceptional customer experiences with our advanced
                    tools.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="goals-card p-4 h-100">
                  <h4 className="fw-bold mb-3">
                    Level your way with a smart help desk solution
                  </h4>
                  <p className="text-muted mb-0">
                    Seek your support operations efficiently with our
                    comprehensive platform.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="goals-card p-4 h-100">
                  <h3 className="fw-bold mb-3">
                    Take your business ahead system in all forms
                  </h3>
                  <p className="text-muted mb-0">
                    Future-pivot your support operations with cutting-edge
                    technology.
                  </p>
                </div>
              </Col>
            </Row>

            <div className="text-center mt-5">
              <Button 
                as={Link} 
                to="/contact" 
                variant="primary" 
                size="lg" 
                className="me-3 px-4 fw-bold"
              >
                Contact Sales
              </Button>
              <Link to="/login">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="px-4 fw-bold"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* --------third section--------------- */}
        <div className="helpdesk-section py-5 text-center">
          <Container>
            <h2 className="fw-bold mb-5">
              Help Desk Software for today's <br /> fast-changing global
              businesses
            </h2>
            <Row className="g-4 justify-content-center">
              <Col md={5}>
                <div className="feature-card bg-blue text-start p-4 rounded border border-primary-subtle">
                  <h5 className="text-primary fw-bold">Bug Tracking</h5>
                  <p className="mb-0">
                    Track and resolve software bugs efficiently with detailed
                    reporting and priority management.
                  </p>
                </div>
              </Col>
              <Col md={5}>
                <div className="feature-card bg-green text-start p-4 rounded border border-success-subtle">
                  <h5 className="text-success fw-bold">For E-commerce</h5>
                  <p className="mb-0">
                    Handle customer inquiries, order issues, and returns with
                    specialized e-commerce workflows.
                  </p>
                </div>
              </Col>
              <Col md={5}>
                <div className="feature-card bg-purple text-start p-4 rounded border border-purple-subtle">
                  <h5 className="text-purple fw-bold">For SaaS & Startups</h5>
                  <p className="mb-0">
                    Scale your customer support as you grow with flexible,
                    startup-friendly solutions.
                  </p>
                </div>
              </Col>
              <Col md={5}>
                <div className="feature-card bg-orange-light text-start p-4 rounded border border-warning-subtle">
                  <h5 className="text-orange fw-bold">For Agencies</h5>
                  <p className="mb-0">
                    Manage multiple client support channels and maintain high
                    service standards across accounts.
                  </p>
                </div>
              </Col>
            </Row>

            <Button
              as={Link}
              to="/Login"
              className="mt-5 px-4 py-2 fw-semibold bg-orange border-0 rounded shadow-sm"
            >
              Get Started
            </Button>
          </Container>
        </div>

        {/* ---------- Additional Links Section ---------- */}
        <section className="additional-links py-5 bg-light">
          <Container>
            <Row className="text-center">
              <Col md={6} className="mb-4 mb-md-0">
                <div className="p-4 h-100 bg-white rounded shadow-sm">
                  <h3 className="fw-bold mb-3">Learn More About Us</h3>
                  <p className="mb-4">
                    Discover our mission, values, and the team behind ServiceHub's 
                    innovative help desk solutions.
                  </p>
                  <Button 
                    as={Link} 
                    to="/about" 
                    variant="outline-primary" 
                    size="lg"
                  >
                    About Us
                  </Button>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-4 h-100 bg-white rounded shadow-sm">
                  <h3 className="fw-bold mb-3">Get In Touch</h3>
                  <p className="mb-4">
                    Have questions or need support? Our team is here to help you 
                    get the most out of ServiceHub.
                  </p>
                  <Button 
                    as={Link} 
                    to="/contact" 
                    variant="primary" 
                    size="lg"
                  >
                    Contact Us
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      
      {/* Chatbot Component - Fixed with higher z-index */}
      <HomepageChatbot />
      
      {/* Footer */}
      <Footer />
    </>
  );
}