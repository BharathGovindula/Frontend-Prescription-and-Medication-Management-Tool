import React from 'react';
import { Box, Alert, AlertIcon, Button } from '@chakra-ui/react';
import { handleError, logError } from '../utils/errorHandler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logError(error);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} maxW="lg" mx="auto">
          <Alert status="error" borderRadius="md" mb={4}>
            <AlertIcon />
            {handleError(this.state.error)}
          </Alert>
          <Button colorScheme="blue" onClick={this.handleReload}>Reload Page</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 