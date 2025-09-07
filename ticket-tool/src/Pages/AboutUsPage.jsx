// import React, { useEffect } from 'react';
// import { Container, Row, Col, Button } from 'react-bootstrap';
// import AboutUsChatbot from '../Components/AboutUsChatBot';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import CustomNavbar from '../Components/CustomNavbar';
// import Footer from '../Components/Footer';
// import { Link } from 'react-router-dom';

// const AboutUsPage = () => {
//   // Scroll to top on page load
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="about-us-page">
//       <CustomNavbar />

//       {/* Hero Section */}
//       <section className="hero-section py-5" style={{ backgroundColor: 'rgb(31 41 55)', color: 'white' }}>
//         <Container>
//           <Row className="align-items-center">
//             <Col lg={6}>
//               <h1 className="display-4 fw-bold mb-4">Optimize Your
//                 Workflow with
//                 Advanced Help Desk
//                 Management Software</h1>
//               <p className="lead mb-4">
//                 Streamline your support operations with our comprehensive platform designed for modern teams. Manage tickets, collaborate effectively, and deliver exceptional customer service.
//               </p>
//               <div className="d-flex gap-3">
//                 <Link to="/services">
//                   <Button variant="warning" size="lg" className="px-4">
//                     Explore Services
//                   </Button>
//                 </Link>
//                 <Link to="/login">
//                   <Button variant="outline-light" size="lg" className="px-4">
//                     Login / Signup
//                   </Button>
//                 </Link>
//               </div>
//             </Col>
//             <Col lg={6} className="mt-5 mt-lg-0">
//               <AboutUsChatbot />
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Optional Animated Feature Section */}
//       <section className="py-5 bg-light">
//         <Container>
//           <Row className="justify-content-center mb-5">
//             <Col md={8} className="text-center">
//               <h2 className="fw-bold mb-3">Why Choose Our Platform?</h2>
//               <p className="lead">Discover the difference with our cutting-edge features</p>
//             </Col>
//           </Row>
//           <Row>
//             {[
//               {
//                 title: "Fast Responses",
//                 description: "Timely replies to your queries by our expert team.",
//                 icon: "🤖"
//               },
//               {
//                 title: "Top-rated Service",
//                 description: "Delivering exceptional service rated highly by customers.",
//                 icon: "📊"
//               },
//               {
//                 title: "Trusted by Thousands",
//                 description: "Our platform is embraced by thousands of satisfied users.",
//                 icon: "🔌"
//               }
//             ].map((feature, index) => (
//               <Col md={4} key={index} className="mb-4">
//                 <div
//                   className="p-4 h-100 bg-white rounded shadow-sm text-center"
//                   style={{
//                     transition: 'transform 0.3s ease',
//                     cursor: 'pointer',
//                     ':hover': {
//                       transform: 'translateY(-5px)'
//                     }
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
//                   onMouseLeave={e => e.currentTarget.style.transform = ''}
//                 >
//                   <div className="display-4 mb-3">{feature.icon}</div>
//                   <h4 className="mb-3">{feature.title}</h4>
//                   <p>{feature.description}</p>
//                 </div>
//               </Col>
//             ))}
//           </Row>
//         </Container>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default AboutUsPage;


import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AboutUsChatbot from '../Components/AboutUsChatBot';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../Components/CustomNavbar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-us-page">
      <CustomNavbar />

      {/* Hero Section */}
      <section className="hero-section1 py-5" style={{
        backgroundColor: 'rgb(31 41 55)',
        color: 'white',
        background: 'linear-gradient(135deg, rgb(31 41 55) 0%, rgb(17 24 39) 100%)'
      }}>
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="pe-lg-4">
                <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: '1.2' }}>
                  Optimize Your
                  <br />
                  Workflow with
                  <br />
                  Advanced Help Desk
                  <br />
                  Management Software
                </h1>
                <p className="lead mb-4 fs-5 opacity-85">
                  Streamline your support operations with our comprehensive platform designed for modern teams. Manage tickets, collaborate effectively, and deliver exceptional customer service.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/services">
                    <Button variant="warning" size="lg" className="px-4 py-3 fw-bold rounded-pill shadow">
                      Explore Services
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline-light" size="lg" className="px-4 py-3 fw-bold rounded-pill">
                      Login / Signup
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={6} className="mt-5 mt-lg-0">
              <div className="d-flex justify-content-center justify-content-lg-end">
                <AboutUsChatbot />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Optional Animated Feature Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col md={8} className="text-center">
              <h2 className="fw-bold mb-3 display-5">Why Choose Our Platform?</h2>
              <p className="lead text-muted">Discover the difference with our cutting-edge features</p>
              <div className="divider mx-auto bg-warning" style={{ width: '80px', height: '4px', borderRadius: '2px' }}></div>
            </Col>
          </Row>
          <Row>
            {[
              {
                title: "Fast Responses",
                description: "Timely replies to your queries by our expert team.",
                icon: "🤖"
              },
              {
                title: "Top-rated Service",
                description: "Delivering exceptional service rated highly by customers.",
                icon: "📊"
              },
              {
                title: "Trusted by Thousands",
                description: "Our platform is embraced by thousands of satisfied users.",
                icon: "🔌"
              }
            ].map((feature, index) => (
              <Col md={4} key={index} className="mb-4">
                <div
                  className="p-4 h-100 bg-white rounded-4 border-0 shadow-sm text-center feature-card"
                  style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                  }}
                >
                  <div
                    className="display-4 mb-3 feature-icon"
                    style={{
                      fontSize: '3.5rem',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="mb-3 fw-bold text-dark">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Footer />

      <style jsx>{`
        .about-us-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        .hero-section1 {
          padding: 6rem 0;
        }
        
        .min-vh-75 {
          min-height: 75vh;
        }
        
        .feature-card {
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .feature-icon {
          transition: transform 0.3s ease;
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }
        
        .divider {
          margin-top: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .hero-section1 {
            padding: 4rem 0;
            text-align: center;
          }
          
          .display-4 {
            font-size: 2.5rem;
          }
          
          .min-vh-75 {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUsPage;