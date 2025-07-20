import React, { useState } from 'react';
import { requestPasswordReset } from '../services/userService';
import { Box, Button, Input, Heading, Alert } from '@chakra-ui/react';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setMessage('Password reset email sent!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
      setMessage('');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Request Password Reset</Heading>
      <form onSubmit={handleSubmit}>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" mb={4} required />
        {error && <Alert status="error" mb={4}>{error}</Alert>}
        {message && <Alert status="success" mb={4}>{message}</Alert>}
        <Button type="submit" colorScheme="blue" width="full">Send Reset Email</Button>
      </form>
    </Box>
  );
};

export default PasswordResetRequest; 