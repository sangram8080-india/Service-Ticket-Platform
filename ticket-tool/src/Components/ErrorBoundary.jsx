import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>An unexpected error occurred. Please try again later.</p>
            <details style={{ whiteSpace: 'pre-wrap', display: 'none' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
            <Button 
              variant="outline-danger" 
              onClick={() => window.location.reload()}
              className="me-2"
            >
              Reload Page
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </Button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;