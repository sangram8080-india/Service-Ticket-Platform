// import React from "react";
// import { Link } from "react-router-dom";
// import heroImage from "../Images/hero-image.jpg";
// import { Container, Row, Col, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../Styles/HomePage.css";
// import Footer from "../Components/Footer";

// // -----------------------------------------
// import CountUp from "react-countup";
// import { motion } from "framer-motion";
// import CustomNavbar from "../Components/CustomNavbar";
// import HomepageChatbot from '../Components/HomepageChatbot';

// const metrics = [
//   { count: 1000000, duration: 1.2, suffix: "+", label: "Tickets Resolved" },
//   { count: 50000, duration: 1.1, suffix: "+", label: "Active Users" },
//   { count: 99.9, duration: 1.5, decimals: 1, suffix: "%", label: "Uptime" },
//   { count: 4.9, duration: 1.2, decimals: 1, suffix: "★", label: "User Rating" },
// ];

// export default function Home() {
//   const orange = "#F7941D";

//   return (
//     <>
//       <CustomNavbar />
//       <div className="homepage">
//         {/* //hero section  */}

//         <div className="container py-5">
//           <div className="row align-items-center">
//             <div className="col-lg-6 mb-5 mb-lg-0">
//               <div className="mb-4">
//                 <i className="bi bi-robot display-3 text-purple"></i>
//               </div>

//               <motion.h1
//                 className="display-4 fw-bold"
//                 style={{ overflow: "hidden" }}
//               >
//                 <motion.div
//                   initial="hidden"
//                   animate="visible"
//                   variants={{
//                     visible: { transition: { staggerChildren: 0.28 } },
//                     hidden: {},
//                   }}
//                 >
//                   <motion.div
//                     variants={{
//                       hidden: { opacity: 0, y: 40 },
//                       visible: { opacity: 1, y: 0 },
//                     }}
//                     transition={{ type: "spring", duration: 0.7 }}
//                   >
//                     <span className="text-gradient-orange">Resolve</span>{" "}
//                     Smarter.
//                   </motion.div>
//                   <motion.div
//                     variants={{
//                       hidden: { opacity: 0, y: 40 },
//                       visible: { opacity: 1, y: 0 },
//                     }}
//                     transition={{ type: "spring", duration: 0.7 }}
//                   >
//                     <span className="text-gradient-orange">Track</span> Faster.
//                   </motion.div>
//                   <motion.div
//                     variants={{
//                       hidden: { opacity: 0, y: 40 },
//                       visible: { opacity: 1, y: 0 },
//                     }}
//                     transition={{ type: "spring", duration: 0.7 }}
//                   >
//                     <span className="text-gradient-orange">Serve</span> Better.
//                   </motion.div>
//                 </motion.div>
//               </motion.h1>

//               <motion.p
//                 className="lead mt-3"
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.8 }}
//               >
//                 Experience the future of service management with AI-powered
//                 automation, real-time tracking, and{" "}
//                 <span className="text-warning">intelligent</span> insights.
//               </motion.p>
//               <motion.div
//                 className="mt-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 1.1 }}
//               >
//                 <Link
//                   to="/SignUp"
//                   className="btn bg-gradient-orange btn-lg me-3"
//                 >
//                   Sign Up
//                 </Link>
//                 <Link to="/login" className="btn btn-outline-dark btn-lg">
//                   Login
//                 </Link>
//               </motion.div>
//               <motion.div
//                 className="row mt-5 text-center"
//                 initial="hidden"
//                 animate="visible"
//                 variants={{
//                   hidden: {},
//                   visible: { transition: { staggerChildren: 0.13 } },
//                 }}
//               >
//                 {metrics.map((metric) => (
//                   <motion.div
//                     key={metric.label}
//                     className="col-6 col-md-3"
//                     variants={{
//                       hidden: { opacity: 0, y: 30 },
//                       visible: { opacity: 1, y: 0 },
//                     }}
//                   >
//                     <h4>
//                       <CountUp
//                         end={metric.count}
//                         duration={metric.duration}
//                         decimals={metric.decimals || 0}
//                         separator=","
//                         suffix={metric.suffix}
//                       />
//                     </h4>
//                     <p className="hero-metric">{metric.label}</p>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </div>
//             <div className="col-lg-6 text-center">
//               <motion.img
//                 src={heroImage}
//                 alt="AI Service Management"
//                 className="hero-img img-fluid rounded shadow"
//                 style={{ maxHeight: "410px", objectFit: "contain" }}
//                 initial={{ scale: 0.92, opacity: 0, y: 30 }}
//                 animate={{ scale: 1, opacity: 1, y: 0 }}
//                 transition={{ type: "spring", duration: 0.9, delay: 0.4 }}
//                 whileHover={{
//                   scale: 1.04,
//                   boxShadow: "0 12px 48px rgba(168, 85, 247, 0.2)",
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* --------------2nd section------------------------- */}
//         {/* Goals Section */}
//         <section className="goals-section py-5">
//           <Container>
//             <div className="text-center mb-5">
//               <h1 className="display-5 fw-bold text-dark">Align your goals.</h1>
//               <p className="fs-4 text-muted">IMPROVE YOUR ROI.</p>
//             </div>

//             <Row className="g-4">
//               <Col md={6}>
//                 <div className="goals-card p-4 h-100">
//                   <h3 className="fw-bold mb-3">
//                     Reduce 60% response time to your ticketing
//                   </h3>
//                   <p className="text-muted mb-0">
//                     Streamline your support process with automated workflows and
//                     smart routing.
//                   </p>
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <div className="goals-card p-4 h-100">
//                   <h3 className="fw-bold mb-3">
//                     Achieve help desk excellence & create value for customers
//                   </h3>
//                   <p className="text-muted mb-0">
//                     Deliver exceptional customer experiences with our advanced
//                     tools.
//                   </p>
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <div className="goals-card p-4 h-100">
//                   <h4 className="fw-bold mb-3">
//                     Level your way with a smart help desk solution
//                   </h4>
//                   <p className="text-muted mb-0">
//                     Seek your support operations efficiently with our
//                     comprehensive platform.
//                   </p>
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <div className="goals-card p-4 h-100">
//                   <h3 className="fw-bold mb-3">
//                     Take your business ahead system in all forms
//                   </h3>
//                   <p className="text-muted mb-0">
//                     Future-pivot your support operations with cutting-edge
//                     technology.
//                   </p>
//                 </div>
//               </Col>
//             </Row>

//             <div className="text-center mt-5">
//               <Button
//                 as={Link}
//                 to="/contact"
//                 variant="primary"
//                 size="lg"
//                 className="me-3 px-4 fw-bold"
//               >
//                 Contact Sales
//               </Button>
//               <Link to="/login">
//                 <Button
//                   variant="outline-primary"
//                   size="lg"
//                   className="px-4 fw-bold"
//                 >
//                   Get Started
//                 </Button>
//               </Link>
//             </div>
//           </Container>
//         </section>

//         {/* --------third section--------------- */}
//         <div className="helpdesk-section py-5 text-center">
//           <Container>
//             <h2 className="fw-bold mb-5">
//               Help Desk Software for today's <br /> fast-changing global
//               businesses
//             </h2>
//             <Row className="g-4 justify-content-center">
//               <Col md={5}>
//                 <div className="feature-card bg-blue text-start p-4 rounded border border-primary-subtle">
//                   <h5 className="text-primary fw-bold">Bug Tracking</h5>
//                   <p className="mb-0">
//                     Track and resolve software bugs efficiently with detailed
//                     reporting and priority management.
//                   </p>
//                 </div>
//               </Col>
//               <Col md={5}>
//                 <div className="feature-card bg-green text-start p-4 rounded border border-success-subtle">
//                   <h5 className="text-success fw-bold">For E-commerce</h5>
//                   <p className="mb-0">
//                     Handle customer inquiries, order issues, and returns with
//                     specialized e-commerce workflows.
//                   </p>
//                 </div>
//               </Col>
//               <Col md={5}>
//                 <div className="feature-card bg-purple text-start p-4 rounded border border-purple-subtle">
//                   <h5 className="text-purple fw-bold">For SaaS & Startups</h5>
//                   <p className="mb-0">
//                     Scale your customer support as you grow with flexible,
//                     startup-friendly solutions.
//                   </p>
//                 </div>
//               </Col>
//               <Col md={5}>
//                 <div className="feature-card bg-orange-light text-start p-4 rounded border border-warning-subtle">
//                   <h5 className="text-orange fw-bold">For Agencies</h5>
//                   <p className="mb-0">
//                     Manage multiple client support channels and maintain high
//                     service standards across accounts.
//                   </p>
//                 </div>
//               </Col>
//             </Row>

//             <Button
//               as={Link}
//               to="/Login"
//               className="mt-5 px-4 py-2 fw-semibold bg-orange border-0 rounded shadow-sm"
//             >
//               Get Started
//             </Button>
//           </Container>
//         </div>

//         {/* ---------- Additional Links Section ---------- */}
//         <section className="additional-links py-5 bg-light">
//           <Container>
//             <Row className="text-center">
//               <Col md={6} className="mb-4 mb-md-0">
//                 <div className="p-4 h-100 bg-white rounded shadow-sm">
//                   <h3 className="fw-bold mb-3">Learn More About Us</h3>
//                   <p className="mb-4">
//                     Discover our mission, values, and the team behind ServiceHub's
//                     innovative help desk solutions.
//                   </p>
//                   <Button
//                     as={Link}
//                     to="/about"
//                     variant="outline-primary"
//                     size="lg"
//                   >
//                     About Us
//                   </Button>
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <div className="p-4 h-100 bg-white rounded shadow-sm">
//                   <h3 className="fw-bold mb-3">Get In Touch</h3>
//                   <p className="mb-4">
//                     Have questions or need support? Our team is here to help you
//                     get the most out of ServiceHub.
//                   </p>
//                   <Button
//                     as={Link}
//                     to="/contact"
//                     variant="primary"
//                     size="lg"
//                   >
//                     Contact Us
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//       </div>

//       {/* Chatbot Component - Fixed with higher z-index */}
//       <HomepageChatbot />

//       {/* Footer */}
//       <Footer />
//     </>
//   );
// }


// src/Components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../Images/hero-image.jpg";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/HomePage.css";
import Footer from "../Components/Footer";

// -----------------------------------------
import CountUp from "react-countup";
import { motion } from "framer-motion";
import CustomNavbar from "../Components/CustomNavbar";
import HomepageChatbot from '../Components/HomepageChatbot';

// Icons
import {
  FaRobot,
  FaRocket,
  FaChartLine,
  FaUsers,
  FaClock,
  FaStar,
  FaLightbulb,
  FaShieldAlt,
  FaCogs,
  FaShoppingCart,
  FaGlobe
} from "react-icons/fa";

const metrics = [
  { count: 1000000, duration: 1.2, suffix: "+", label: "Tickets Resolved", icon: <FaClock className="metric-icon" /> },
  { count: 50000, duration: 1.1, suffix: "+", label: "Active Users", icon: <FaUsers className="metric-icon" /> },
  { count: 99.9, duration: 1.5, decimals: 1, suffix: "%", label: "Uptime", icon: <FaChartLine className="metric-icon" /> },
  { count: 4.9, duration: 1.2, decimals: 1, suffix: "★", label: "User Rating", icon: <FaStar className="metric-icon" /> },
];

const features = [
  {
    title: "Bug Tracking",
    description: "Track and resolve software bugs efficiently with detailed reporting and priority management.",
    icon: <FaShieldAlt className="feature-icon" />,
    color: "primary"
  },
  {
    title: "For E-commerce",
    description: "Handle customer inquiries, order issues, and returns with specialized e-commerce workflows.",
    icon: <FaShoppingCart className="feature-icon" />,
    color: "success"
  },
  {
    title: "For SaaS & Startups",
    description: "Scale your customer support as you grow with flexible, startup-friendly solutions.",
    icon: <FaRocket className="feature-icon" />,
    color: "purple"
  },
  {
    title: "For Agencies",
    description: "Manage multiple client support channels and maintain high service standards across accounts.",
    icon: <FaGlobe className="feature-icon" />,
    color: "warning"
  }
];

export default function Home() {
  const orange = "#F7941D";

  return (
    <>
      <CustomNavbar />
      <div className="homepage">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="hero-badge">
                    <FaRobot className="me-2" />
                    AI-Powered Service Management
                  </div>
                </motion.div>

                <motion.h1
                  className="display-4 fw-bold hero-heading"
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
                  className="lead mt-3 hero-subtitle"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Experience the future of service management with AI-powered
                  automation, real-time tracking, and{" "}
                  <span className="text-warning fw-semibold">intelligent</span> insights.
                </motion.p>

                <motion.div
                  className="mt-4 hero-cta"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  <Link
                    to="/SignUp"
                    className="btn bg-gradient-orange btn-lg me-3 px-4 py-3 fw-bold"
                  >
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn btn-outline-dark btn-lg px-4 py-3">
                    Schedule Demo
                  </Link>
                </motion.div>

                <motion.div
                  className="row mt-5 hero-metrics"
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
                      className="col-6 col-md-3 metric-item"
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <div className="metric-content">
                        {metric.icon}
                        <h4 className="mt-2">
                          <CountUp
                            end={metric.count}
                            duration={metric.duration}
                            decimals={metric.decimals || 0}
                            separator=","
                            suffix={metric.suffix}
                          />
                        </h4>
                        <p className="hero-metric">{metric.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="col-lg-6 text-center">
                <motion.div
                  className="hero-image-container"
                  initial={{ scale: 0.92, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", duration: 0.9, delay: 0.4 }}
                >
                  <img
                    src={heroImage}
                    alt="AI Service Management"
                    className="hero-img img-fluid rounded"
                  />
                  <div className="hero-image-overlay"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="goals-section py-5">
          <Container>
            <motion.div
              className="text-center mb-5 section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="display-5 fw-bold text-dark">Align your goals.</h2>
              <p className="fs-4 text-muted">IMPROVE YOUR ROI.</p>
              <div className="section-divider"></div>
            </motion.div>

            <Row className="g-4">
              <Col md={6} lg={3}>
                <motion.div
                  className="goals-card p-4 h-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="goal-icon mb-3">
                    <FaClock className="text-orange" />
                  </div>
                  <h4 className="fw-bold mb-3">
                    Reduce 60% response time to your ticketing
                  </h4>
                  <p className="text-muted mb-0">
                    Streamline your support process with automated workflows and
                    smart routing.
                  </p>
                </motion.div>
              </Col>

              <Col md={6} lg={3}>
                <motion.div
                  className="goals-card p-4 h-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="goal-icon mb-3">
                    <FaStar className="text-orange" />
                  </div>
                  <h4 className="fw-bold mb-3">
                    Achieve help desk excellence & create value for customers
                  </h4>
                  <p className="text-muted mb-0">
                    Deliver exceptional customer experiences with our advanced
                    tools.
                  </p>
                </motion.div>
              </Col>

              <Col md={6} lg={3}>
                <motion.div
                  className="goals-card p-4 h-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="goal-icon mb-3">
                    <FaLightbulb className="text-orange" />
                  </div>
                  <h4 className="fw-bold mb-3">
                    Level your way with a smart help desk solution
                  </h4>
                  <p className="text-muted mb-0">
                    Seek your support operations efficiently with our
                    comprehensive platform.
                  </p>
                </motion.div>
              </Col>

              <Col md={6} lg={3}>
                <motion.div
                  className="goals-card p-4 h-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="goal-icon mb-3">
                    <FaRocket className="text-orange" />
                  </div>
                  <h4 className="fw-bold mb-3">
                    Take your business ahead system in all forms
                  </h4>
                  <p className="text-muted mb-0">
                    Future-pivot your support operations with cutting-edge
                    technology.
                  </p>
                </motion.div>
              </Col>
            </Row>

            <motion.div
              className="text-center mt-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                as={Link}
                to="/contact"
                variant="primary"
                size="lg"
                className="me-3 px-4 py-3 fw-bold cta-button"
              >
                Contact Sales
              </Button>
              <Link to="/login">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="px-4 py-3 fw-bold"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="features-section py-5">
          <Container>
            <motion.div
              className="text-center mb-5 section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="display-5 fw-bold text-dark">
                Help Desk Software for today's fast-changing global businesses
              </h2>
              <p className="lead text-muted">Tailored solutions for every industry</p>
              <div className="section-divider"></div>
            </motion.div>

            <Row className="g-4 justify-content-center">
              {features.map((feature, index) => (
                <Col md={6} lg={5} key={index}>
                  <motion.div
                    className={`feature-card p-4 rounded h-100 border-${feature.color} feature-${feature.color}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="d-flex align-items-start">
                      <div className="feature-icon-container me-3">
                        {feature.icon}
                      </div>
                      <div>
                        <h5 className={`text-${feature.color} fw-bold`}>{feature.title}</h5>
                        <p className="mb-0">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>

            <motion.div
              className="text-center mt-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                as={Link}
                to="/Login"
                className="px-5 py-3 fw-semibold bg-orange border-0 rounded-pill cta-button"
                size="lg"
              >
                Start Your Free Trial
              </Button>
            </motion.div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-5 bg-gradient">
          <Container>
            <Row className="align-items-center">
              <Col md={8} className="mb-4 mb-md-0">
                <h2 className="fw-bold text-white mb-3">Ready to transform your service management?</h2>
                <p className="text-light mb-0">Join thousands of companies that trust ServiceHub for their support needs.</p>
              </Col>
              <Col md={4} className="text-md-end">
                <Button
                  as={Link}
                  to="/signup"
                  variant="light"
                  size="lg"
                  className="px-4 py-3 fw-bold rounded-pill"
                >
                  Get Started Now
                </Button>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Additional Links Section */}
        <section className="additional-links py-5">
          <Container>
            <Row className="text-center">
              <Col md={6} className="mb-4 mb-md-0">
                <motion.div
                  className="p-4 h-100 bg-white rounded shadow-sm link-card"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="link-icon mb-3">
                    <FaUsers className="text-primary" />
                  </div>
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
                    className="rounded-pill px-4"
                  >
                    About Us
                  </Button>
                </motion.div>
              </Col>

              <Col md={6}>
                <motion.div
                  className="p-4 h-100 bg-white rounded shadow-sm link-card"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="link-icon mb-3">
                    <FaCogs className="text-primary" />
                  </div>
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
                    className="rounded-pill px-4"
                  >
                    Contact Us
                  </Button>
                </motion.div>
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