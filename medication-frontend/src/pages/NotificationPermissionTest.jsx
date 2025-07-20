import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Alert } from '@chakra-ui/react';

const NotificationPermissionTest = () => {
  const [status, setStatus] = useState('default');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if ('Notification' in window) {
      setStatus(Notification.permission);
    } else {
      setStatus('unsupported');
    }
  }, []);

  const handleRequest = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setStatus(permission);
    setMessage(`Permission is now: ${permission}`);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Notification Permission Test</Heading>
      <Text mb={4}>Current status: <b>{status}</b></Text>
      {status !== 'unsupported' && (
        <Button colorScheme="blue" onClick={handleRequest}>Request Permission</Button>
      )}
      {message && <Alert status="info" mt={4}>{message}</Alert>}
      {status === 'unsupported' && <Alert status="error" mt={4}>Notifications are not supported in this browser.</Alert>}
    </Box>
  );
};

export default NotificationPermissionTest; 