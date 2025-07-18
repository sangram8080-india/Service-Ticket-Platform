// src/Home.js
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to Our Application</h1>
      <div className="auth-links">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
      </div>
    </div>
  );
}