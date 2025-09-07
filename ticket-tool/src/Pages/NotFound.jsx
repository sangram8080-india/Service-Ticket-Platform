// import React from 'react';
// import { Link } from 'react-router-dom';

// const NotFound = () => {
//   return (
//     <div className="not-found">
//       <h1>404 - Page Not Found</h1>
//       <p>The page you are looking for doesn't exist or has been moved.</p>
//       <Link to="/" className="home-link">
//         Return to Home
//       </Link>
//     </div>
//   );
// };

// export default NotFound;


import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div
      className="not-found d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '2rem',
        overflow: 'hidden'
      }}
    >
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '600px' }}
      >
        {/* Animated 404 number */}
        <motion.div
          className="position-relative mb-4"
          variants={pulseVariants}
          animate="animate"
        >
          <h1
            className="display-1 fw-bold mb-0"
            style={{
              fontSize: 'clamp(6rem, 20vw, 12rem)',
              background: 'linear-gradient(135deg, #F7941D 0%, #f76c1d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}
          >
            404
          </h1>

          {/* Decorative elements */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-30px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(247, 148, 29, 0.1)',
              zIndex: -1
            }}
          />

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '-40px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(247, 148, 29, 0.15)',
              zIndex: -1
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="h3 fw-bold mb-3"
          style={{ color: '#2D3748', fontSize: '1.75rem' }}
        >
          Oops! Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mb-4 lead"
          style={{ color: '#555', fontSize: '1.1rem', lineHeight: 1.6 }}
        >
          The page you are looking for doesn't exist or might have been moved to a different location.
        </motion.p>

        {/* Home link button */}
        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className="btn fw-bold px-5 py-3 rounded-pill text-white border-0"
            style={{
              background: 'linear-gradient(135deg, #F7941D 0%, #f76c1d 100%)',
              fontSize: '1.1rem',
              boxShadow: '0 10px 25px rgba(247, 148, 29, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 30px rgba(247, 148, 29, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(247, 148, 29, 0.3)';
            }}
          >
            Return to Homepage
            <motion.span
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
              }}
              animate={{
                left: ['-50%', '150%', '150%'],
                transition: { duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }
              }}
            />
          </Link>
        </motion.div>

        {/* Additional helpful links */}
        <motion.div
          variants={itemVariants}
          className="mt-5 pt-4"
          style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
        >
          <p className="small text-muted mb-2">You might also want to visit:</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/services"
              className="text-decoration-none small"
              style={{ color: '#F7941D' }}
            >
              Our Services
            </Link>
            <Link
              to="/about"
              className="text-decoration-none small"
              style={{ color: '#F7941D' }}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-decoration-none small"
              style={{ color: '#F7941D' }}
            >
              Contact Support
            </Link>
          </div>
        </motion.div>

        {/* Decorative background elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(247, 148, 29, 0.05)',
            zIndex: -1
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '8%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(247, 148, 29, 0.03)',
            zIndex: -1
          }}
        />
      </motion.div>
    </div>
  );
};

export default NotFound;