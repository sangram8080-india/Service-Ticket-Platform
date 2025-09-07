
// import React, { useState } from 'react';
// import Footer from '../Components/Footer';
// import CustomNavbar from '../Components/CustomNavbar';
// import { FaPhoneAlt, FaEnvelopeOpenText, FaMapMarkerAlt } from "react-icons/fa";
// import '../Styles/ContactUs.css'; // Add this import

// const ContactUs = () => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     message: '',
//     phone: '',
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (form.name && form.email && form.message) {
//       setSubmitted(true);
//       setForm({ name: '', email: '', message: '', phone: '' });
//       setTimeout(() => setSubmitted(false), 3500); // Optional: auto-hide success
//     }
//   };

//   const mainImage =
//     'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg';

//   return (
//     <>
//       <CustomNavbar />
//       <div className="container py-5">
//         <div className="row align-items-center shadow rounded-4 bg-white overflow-hidden contact-animate-container">
//           <div className="col-md-6 p-0 d-flex align-items-stretch">
//             <img
//               src={mainImage}
//               alt="Contact Us"
//               className="img-fluid h-100 w-100 object-fit-cover"
//               style={{
//                 minHeight: 400,
//                 objectFit: 'cover',
//               }}
//             />
//           </div>
//           <div className="col-md-6 p-5">
//             <h2 className="fw-bold" style={{ color: '#282f39', marginBottom: 10 }}>
//               Contact Us
//             </h2>
//             <p className="mb-4" style={{ color: '#858c96' }}>
//               We’d love to hear from you! Reach out with questions or business inquiries.
//               Our team replies within one business day.
//             </p>
//             <form onSubmit={handleSubmit} noValidate>
//               <div className="form-floating mb-3">
//                 <input
//                   type="text"
//                   id="floatingName"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="form-control"
//                   placeholder="Your Name"
//                   required
//                   style={{ background: '#f6f8fa' }}
//                 />
//                 <label htmlFor="floatingName">Your Name</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   type="email"
//                   id="floatingEmail"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   className="form-control"
//                   placeholder="name@example.com"
//                   required
//                   style={{ background: '#f6f8fa' }}
//                 />
//                 <label htmlFor="floatingEmail">Email address</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <input
//                   type="tel"
//                   id="floatingPhone"
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                   className="form-control"
//                   placeholder="Phone"
//                   style={{ background: '#f6f8fa' }}
//                 />
//                 <label htmlFor="floatingPhone">Phone (optional)</label>
//               </div>
//               <div className="form-floating mb-3">
//                 <textarea
//                   id="floatingMessage"
//                   name="message"
//                   value={form.message}
//                   onChange={handleChange}
//                   className="form-control"
//                   placeholder="Leave your message here"
//                   style={{ height: 100, background: '#f6f8fa' }}
//                   required
//                 />
//                 <label htmlFor="floatingMessage">Your Message</label>
//               </div>
//               <button
//                 type="submit"
//                 className="btn btn-lg btn-send-animate"
//                 style={{
//                   background: '#ff8b2d',
//                   color: '#fff',
//                   fontWeight: 600,
//                   borderRadius: 50,
//                   width: '100%',
//                   marginTop: 10,
//                 }}
//                 disabled={!form.name || !form.email || !form.message}
//               >
//                 Send Message
//               </button>

//               {submitted && (
//                 <div className="alert alert-success mt-3 animate-success" role="alert">
//                   Thank you! Your message has been received.
//                 </div>
//               )}
//             </form>
//             {/* Quick Direct Details */}
//             <div className="mt-5 quick-details">
//               <div className="d-flex flex-column gap-2" style={{ fontSize: '1.05rem', color: '#282f39' }}>
//                 <div>
//                   <FaPhoneAlt className="contact-icon" />{' '}
//                   <span className="fw-bold text-orange">Phone:</span> +91 12345 67890
//                 </div>
//                 <div>
//                   <FaEnvelopeOpenText className="contact-icon" />{' '}
//                   <span className="fw-bold text-orange">Email:</span> info@example.com
//                 </div>
//                 <div>
//                   <FaMapMarkerAlt className="contact-icon" />{' '}
//                   <span className="fw-bold text-orange">Address:</span> 123 Business Road, City, India
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ContactUs;



import React, { useState } from 'react';
import Footer from '../Components/Footer';
import CustomNavbar from '../Components/CustomNavbar';
import { FaPhoneAlt, FaEnvelopeOpenText, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { motion } from 'framer-motion';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '', phone: '' });
      setTimeout(() => setSubmitted(false), 3500); // Optional: auto-hide success
    }
  };

  const mainImage =
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="container py-5" style={{ minHeight: '80vh' }}>
        <motion.div
          className="row align-items-center rounded-4 bg-white overflow-hidden shadow-lg border-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            background: '#ffffff',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Image Section */}
          <div className="col-md-6 p-0 d-flex align-items-stretch position-relative">
            <div
              className="position-absolute w-100 h-100"
              style={{
                background: 'linear-gradient(135deg, rgba(247, 148, 29, 0.08) 0%, transparent 70%)',
                zIndex: 1
              }}
            />
            <img
              src={mainImage}
              alt="Contact Us"
              className="img-fluid h-100 w-100 object-fit-cover"
              style={{
                minHeight: '550px',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Form Section */}
          <div className="col-md-6 p-4 p-xl-5">
            <motion.h2
              className="fw-bold mb-3"
              variants={itemVariants}
              style={{
                color: '#1A202C',
                fontSize: '2rem',
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}
            >
              Contact Us
            </motion.h2>

            <motion.p
              className="mb-4"
              variants={itemVariants}
              style={{
                color: '#4A5568',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}
            >
              We'd love to hear from you! Reach out with questions or business inquiries.
              Our team replies within one business day.
            </motion.p>

            <motion.form onSubmit={handleSubmit} noValidate variants={itemVariants}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control py-3 px-4"
                  placeholder="Your Name"
                  required
                  style={{
                    background: '#fafafa',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F7941D';
                    e.target.style.boxShadow = '0 0 0 3px rgba(247, 148, 29, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control py-3 px-4"
                  placeholder="Email address"
                  required
                  style={{
                    background: '#fafafa',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F7941D';
                    e.target.style.boxShadow = '0 0 0 3px rgba(247, 148, 29, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div className="mb-3">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control py-3 px-4"
                  placeholder="Phone (optional)"
                  style={{
                    background: '#fafafa',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F7941D';
                    e.target.style.boxShadow = '0 0 0 3px rgba(247, 148, 29, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div className="mb-4">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="form-control py-3 px-4"
                  placeholder="Your Message"
                  style={{
                    height: 120,
                    background: '#fafafa',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    border: '1px solid #e2e8f0',
                    resize: 'vertical',
                    transition: 'all 0.2s ease'
                  }}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F7941D';
                    e.target.style.boxShadow = '0 0 0 3px rgba(247, 148, 29, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <motion.button
                type="submit"
                className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #F7941D 0%, #FF6B00 100%)',
                  color: '#fff',
                  fontWeight: '600',
                  borderRadius: '10px',
                  padding: '0.875rem 2rem',
                  border: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(247, 148, 29, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                disabled={!form.name || !form.email || !form.message}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 6px 16px rgba(247, 148, 29, 0.35)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPaperPlane />
                Send Message
              </motion.button>

              {submitted && (
                <motion.div
                  className="mt-3 p-3 rounded"
                  role="alert"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                    fontSize: '0.9rem'
                  }}
                >
                  Thank you! Your message has been received.
                </motion.div>
              )}
            </motion.form>

            {/* Quick Direct Details */}
            <motion.div
              className="mt-5 pt-4"
              variants={itemVariants}
              style={{ borderTop: '1px solid #e2e8f0' }}
            >
              <h5 className="fw-semibold mb-3" style={{ color: '#1A202C', fontSize: '1.1rem' }}>Contact Information</h5>
              <div className="d-flex flex-column gap-3" style={{ color: '#2D3748' }}>
                <div className="d-flex align-items-center">
                  <div className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(247, 148, 29, 0.1)',
                      color: '#F7941D',
                      flexShrink: 0
                    }}
                  >
                    <FaPhoneAlt size={14} />
                  </div>
                  <div style={{ lineHeight: '1.4' }}>
                    <div className="fw-medium" style={{ color: '#F7941D', fontSize: '0.9rem' }}>Phone</div>
                    <div style={{ fontSize: '0.95rem' }}>+91 12345 67890</div>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(247, 148, 29, 0.1)',
                      color: '#F7941D',
                      flexShrink: 0
                    }}
                  >
                    <FaEnvelopeOpenText size={14} />
                  </div>
                  <div style={{ lineHeight: '1.4' }}>
                    <div className="fw-medium" style={{ color: '#F7941D', fontSize: '0.9rem' }}>Email</div>
                    <div style={{ fontSize: '0.95rem' }}>info@example.com</div>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(247, 148, 29, 0.1)',
                      color: '#F7941D',
                      flexShrink: 0
                    }}
                  >
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <div style={{ lineHeight: '1.4' }}>
                    <div className="fw-medium" style={{ color: '#F7941D', fontSize: '0.9rem' }}>Address</div>
                    <div style={{ fontSize: '0.95rem' }}>123 Business Road, City, India</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;