import React, { useState } from 'react';
import { resetPassword } from '../services/userService';
import { Box, Button, Input, Heading, Alert } from '@chakra-ui/react';

const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(token, password);
      setMessage('Password reset successful!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
      setMessage('');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Reset Password</Heading>
      <form onSubmit={handleSubmit}>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" mb={4} required />
        {error && <Alert status="error" mb={4}>{error}</Alert>}
        {message && <Alert status="success" mb={4}>{message}</Alert>}
        <Button type="submit" colorScheme="blue" width="full">Reset Password</Button>
      </form>
    </Box>
  );
};

export default PasswordReset; 