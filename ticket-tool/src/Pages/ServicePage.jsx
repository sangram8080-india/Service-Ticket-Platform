// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import CustomNavbar from "../Components/CustomNavbar";
// import Footer from "../Components/Footer";
// import { Link } from "react-router-dom";

// export default function ServicePage() {
//   // Theme colors
//   const orange = "#F7941D";

//   // Service items
//   const services = [
//     {
//       icon: "bi bi-ticket-detailed-fill",
//       title: "Smart Ticket Management",
//       desc: "Automate, prioritize, and resolve tickets fast with powerful workflows and performance analytics.",
//     },
//     {
//       icon: "bi bi-people-fill",
//       title: "Team Collaboration",
//       desc: "Empower your team with real-time chat and shared knowledge bases for seamless collaboration.",
//     },
//     {
//       icon: "bi bi-bar-chart-fill",
//       title: "Advanced Analytics",
//       desc: "Gain insights into your support KPIs with real-time, customizable dashboards and reports.",
//     },
//   ];

//   // Feature highlights
//   const features = [
//     "24/7 Customer Support",
//     "Automated Responses",
//     "Multi-Channel Integration",
//     "Customizable Workflows",
//   ];

//   return (
//     <div
//       style={{
//         background: "#F5F5F5",
//         minHeight: "100vh",
//         fontFamily: "Inter, sans-serif",
//       }}
//     >
//       <CustomNavbar />

//       {/* Hero Section */}
//       <section
//         style={{
//           background: `linear-gradient(100deg, #232323 60%, ${orange} 100%)`,
//           color: "#FFF",
//           minHeight: "40vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: "3rem 1rem",
//           borderRadius: "0 0 48px 48px",
//           textAlign: "center",
//         }}
//       >
//         <h1
//           className="fw-bold"
//           style={{ fontSize: "2.8rem", maxWidth: 600, lineHeight: 1.2 }}
//         >
//           Provide Exceptional{" "}
//           <span style={{ color: orange }}>Customer Support</span>
//           <br />
//           Everyday.
//         </h1>
//         <p
//           className="lead mt-3"
//           style={{
//             maxWidth: 500,
//             color: "rgba(255, 255, 255, 0.85)",
//             fontSize: "1.125rem",
//           }}
//         >
//           Our comprehensive platform helps you deliver outstanding support
//           experiences with advanced tools, analytics, and automation.
//         </p>
//       </section>

//       {/* Our Services */}
//       <section
//         style={{ backgroundColor: "#fff", padding: "4rem 0", color: "#232323" }}
//       >
//         <div className="container text-center mb-5">
//           <h2 style={{ color: orange, fontWeight: "700" }}>Our Services</h2>
//           <p
//             style={{
//               maxWidth: 600,
//               margin: "0.5rem auto 2rem auto",
//               fontSize: "1.15rem",
//               color: "#444",
//             }}
//           >
//             Streamline your support with intelligent automation and modern
//             teamwork tools.
//           </p>
//         </div>

//         <div className="container">
//           <div className="row g-4 justify-content-center">
//             {services.map((svc, idx) => (
//               <div className="col-12 col-md-4" key={svc.title}>
//                 <div
//                   className="card h-100 text-center shadow-sm"
//                   style={{
//                     borderRadius: "1rem",
//                     transition: "transform 0.3s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform =
//                       "translateY(-6px) scale(1.02)";
//                     e.currentTarget.style.boxShadow = `0 10px 25px rgba(247,148,29,0.3)`;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "none";
//                     e.currentTarget.style.boxShadow =
//                       "0 1px 6px rgba(0,0,0,0.1)";
//                   }}
//                   tabIndex={0}
//                   aria-label={`Service: ${svc.title}`}
//                 >
//                   <div className="card-body">
//                     <i
//                       className={svc.icon}
//                       style={{
//                         color: orange,
//                         fontSize: "2.5rem",
//                         marginBottom: "1rem",
//                       }}
//                       aria-hidden="true"
//                     />
//                     <h5 className="fw-semibold mb-2">{svc.title}</h5>
//                     <p style={{ color: "#555" }}>{svc.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="my-5">
//         <div className="container">
//           <div className="row align-items-center gy-4">
//             <div className="col-md-6">
//               <img
//                 src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?fit=crop&w=600"
//                 alt="Support Team"
//                 className="img-fluid rounded shadow"
//                 style={{ border: `3px solid ${orange}`, maxWidth: "100%" }}
//                 loading="lazy"
//               />
//             </div>
//             <div className="col-md-6 d-flex flex-column justify-content-center">
//               <h3 style={{ color: orange }} className="fw-bold mb-3">
//                 Powerful Features
//               </h3>
//               <ul
//                 className="list-group list-group-flush mb-3"
//                 style={{ maxWidth: 400 }}
//               >
//                 {features.map((f, i) => (
//                   <li
//                     key={f}
//                     className="list-group-item border-0 ps-0 d-flex align-items-center"
//                     style={{
//                       background: "#fff",
//                       color: "#444",
//                       fontSize: "1rem",
//                     }}
//                   >
//                     <i
//                       className="bi bi-check-circle-fill text-success me-2"
//                       aria-hidden="true"
//                     />
//                     {f}
//                   </li>
//                 ))}
//               </ul>
//               <p className="text-secondary" style={{ maxWidth: 400 }}>
//                 Scale your business with tools designed for modern support
//                 teams.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>


//       {/* Testimonial/Call-to-Action Section */}
//       <section
//         style={{
//           background: "#232B34",
//           color: "#fff",
//           padding: "4rem 1rem",
//           textAlign: "center",
//         }}
//       >
//         <h2
//           style={{
//             fontWeight: 800,
//             fontSize: "2rem",
//             maxWidth: 700,
//             margin: "0 auto 1rem auto",
//             lineHeight: 1.3,
//           }}
//         >
//           Thousands of great companies call
//           <br />
//           <span style={{ color: "#F7941D" }}>ServiceHub</span> for a great
//           friend
//         </h2>
//         <p
//           className="mb-4"
//           style={{
//             color: "#B9C5D2",
//             maxWidth: 520,
//             margin: "0 auto 2rem auto",
//             fontSize: "1.08rem",
//           }}
//         >
//           Join the growing community of businesses that trust ServiceHub to
//           deliver exceptional customer support experiences.
//         </p>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: 16,
//             flexWrap: "wrap",
//           }}
//         >
//           <button
//             className="btn btn-outline-light fw-bold px-4 py-2"
//             style={{
//               borderRadius: "1.5rem",
//               borderWidth: 2,
//               fontSize: "1rem",
//             }}
//           >
//             Start 14-day trial
//           </button>
//           <Link to="/login">
//             <button
//               className="btn fw-bold px-4 py-2"
//               style={{
//                 borderRadius: "1.5rem",
//                 background: "#F7941D",
//                 color: "#fff",
//                 border: "none",
//                 fontSize: "1rem",
//               }}
//             >
//               Get Started
//             </button>
//           </Link>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }



import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import CustomNavbar from "../Components/CustomNavbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

export default function ServicePage() {
  // Theme colors
  const orange = "#F7941D";

  // Service items
  const services = [
    {
      icon: "bi bi-ticket-detailed-fill",
      title: "Smart Ticket Management",
      desc: "Automate, prioritize, and resolve tickets fast with powerful workflows and performance analytics.",
    },
    {
      icon: "bi bi-people-fill",
      title: "Team Collaboration",
      desc: "Empower your team with real-time chat and shared knowledge bases for seamless collaboration.",
    },
    {
      icon: "bi bi-bar-chart-fill",
      title: "Advanced Analytics",
      desc: "Gain insights into your support KPIs with real-time, customizable dashboards and reports.",
    },
  ];

  // Feature highlights
  const features = [
    "24/7 Customer Support",
    "Automated Responses",
    "Multi-Channel Integration",
    "Customizable Workflows",
  ];

  return (
    <div
      style={{
        background: "#F5F5F5",
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <CustomNavbar />

      {/* Hero Section */}
      <section
        style={{
          background: `linear-gradient(135deg, #232323 0%, #2D3748 100%)`,
          color: "#FFF",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "4rem 1rem",
          borderRadius: "0 0 48px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, rgba(247, 148, 29, 0.15) 0%, transparent 50%)",
          pointerEvents: "none"
        }}></div>

        <h1
          className="fw-bold mb-4"
          style={{
            fontSize: "3rem",
            maxWidth: 700,
            lineHeight: 1.2,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }}
        >
          Provide Exceptional{" "}
          <span style={{
            color: orange,
            background: "linear-gradient(135deg, #F7941D 0%, #FFB76B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Customer Support
          </span>
          <br />
          Everyday.
        </h1>
        <p
          className="lead mt-3 mb-4"
          style={{
            maxWidth: 600,
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "1.25rem",
            fontWeight: 400,
          }}
        >
          Our comprehensive platform helps you deliver outstanding support
          experiences with advanced tools, analytics, and automation.
        </p>
        <div className="mt-3">
          <Link to="/services">
            <button
              className="btn btn-warning btn-lg fw-bold px-4 py-3 rounded-pill me-3 shadow"
              style={{ background: orange, border: "none" }}
            >
              Explore Our Services
            </button>
          </Link>
        </div>
      </section>

      {/* Our Services */}
      <section
        style={{
          backgroundColor: "#fff",
          padding: "5rem 0",
          color: "#232323",
          position: "relative"
        }}
      >
        <div className="container text-center mb-5">
          <h2 style={{
            color: orange,
            fontWeight: "800",
            fontSize: "2.5rem",
            marginBottom: "1rem"
          }}>
            Our Services
          </h2>
          <p
            style={{
              maxWidth: 600,
              margin: "0 auto",
              fontSize: "1.2rem",
              color: "#555",
              lineHeight: 1.6
            }}
          >
            Streamline your support with intelligent automation and modern
            teamwork tools.
          </p>
        </div>

        <div className="container">
          <div className="row g-4 justify-content-center">
            {services.map((svc, idx) => (
              <div className="col-12 col-md-4" key={svc.title}>
                <div
                  className="card h-100 text-center border-0"
                  style={{
                    borderRadius: "1.5rem",
                    transition: "all 0.3s ease",
                    background: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(247,148,29,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
                  }}
                  tabIndex={0}
                  aria-label={`Service: ${svc.title}`}
                >
                  <div className="card-body p-4">
                    <div
                      className="icon-container mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(135deg, rgba(247, 148, 29, 0.1) 0%, rgba(247, 148, 29, 0.2) 100%)",
                        fontSize: "2.2rem",
                        color: orange
                      }}
                    >
                      <i className={svc.icon} aria-hidden="true" />
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: "#2D3748", fontSize: "1.3rem" }}>{svc.title}</h5>
                    <p style={{ color: "#555", lineHeight: 1.6 }}>{svc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ background: "#F8F9FA" }}>
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-md-6">
              <div
                className="rounded-4 overflow-hidden shadow-lg"
                style={{
                  border: `4px solid ${orange}`,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?fit=crop&w=600"
                  alt="Support Team"
                  className="img-fluid"
                  loading="lazy"
                  style={{ transition: "transform 0.3s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
            </div>
            <div className="col-md-6 d-flex flex-column justify-content-center ps-md-5">
              <h3 style={{ color: orange }} className="fw-bold mb-4 display-5">
                Powerful Features
              </h3>
              <ul
                className="list-unstyled mb-4"
                style={{ maxWidth: 400 }}
              >
                {features.map((f, i) => (
                  <li
                    key={f}
                    className="mb-3 d-flex align-items-center"
                    style={{
                      color: "#2D3748",
                      fontSize: "1.1rem",
                    }}
                  >
                    <div className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "linear-gradient(135deg, #F7941D 0%, #FFB76B 100%)",
                        color: "white",
                        fontSize: "1rem"
                      }}
                    >
                      <i className="bi bi-check-lg" aria-hidden="true" />
                    </div>
                    <span style={{ fontWeight: 500 }}>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted" style={{ maxWidth: 400, fontSize: "1.1rem" }}>
                Scale your business with tools designed for modern support
                teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Call-to-Action Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #232B34 0%, #1A202C 100%)",
          color: "#fff",
          padding: "5rem 1rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 70% 20%, rgba(247, 148, 29, 0.1) 0%, transparent 50%)",
          pointerEvents: "none"
        }}></div>

        <h2
          style={{
            fontWeight: 800,
            fontSize: "2.5rem",
            maxWidth: 800,
            margin: "0 auto 1.5rem auto",
            lineHeight: 1.3,
          }}
        >
          Thousands of great companies call
          <br />
          <span style={{
            color: "#F7941D",
            background: "linear-gradient(135deg, #F7941D 0%, #FFB76B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            ServiceHub
          </span> for a great friend
        </h2>
        <p
          className="mb-5"
          style={{
            color: "#B9C5D2",
            maxWidth: 520,
            margin: "0 auto 3rem auto",
            fontSize: "1.15rem",
            lineHeight: 1.6
          }}
        >
          Join the growing community of businesses that trust ServiceHub to
          deliver exceptional customer support experiences.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn btn-outline-light fw-bold px-4 py-3"
            style={{
              borderRadius: "2rem",
              borderWidth: 2,
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              minWidth: "160px"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#232B34";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "white";
            }}
          >
            Start 14-day trial
          </button>
          <Link to="/login">
            <button
              className="btn fw-bold px-4 py-3"
              style={{
                borderRadius: "2rem",
                background: "linear-gradient(135deg, #F7941D 0%, #FFB76B 100%)",
                color: "#fff",
                border: "none",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                minWidth: "160px",
                boxShadow: "0 10px 25px rgba(247, 148, 29, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 15px 30px rgba(247, 148, 29, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "none";
                e.target.style.boxShadow = "0 10px 25px rgba(247, 148, 29, 0.3)";
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}