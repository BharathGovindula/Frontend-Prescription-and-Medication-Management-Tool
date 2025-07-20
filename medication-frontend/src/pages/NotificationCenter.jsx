import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, 
  Heading, 
  Text, 
  Spinner, 
  Alert, 
  AlertIcon,
  Button, 
  Badge, 
  VStack, 
  HStack, 
  IconButton, 
  useToast,
  Container,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  useColorModeValue,
  Tooltip,
  SimpleGrid,
  Progress,
  Center
} from '@chakra-ui/react';
import { 
  RepeatIcon, 
  BellIcon, 
  CheckIcon, 
  TimeIcon, 
  WarningIcon, 
  InfoIcon, 
  CloseIcon 
} from '@chakra-ui/icons';
import { getToken } from '../utils/token';
import { requestNotificationPermission, showNotification } from '../utils/notifications';
import { setReminders, getReminders} from '../utils/db';
import { useReminders } from '../hooks/useReminders';

const statusColors = {
  pending: 'yellow',
  sent: 'blue',
  acknowledged: 'green',
  snoozed: 'purple',
  missed: 'red',
};

const NotificationCenter = () => {
  const { reminders, remindersLoading, remindersError, fetchReminders, setReminders } = useReminders();
  const [actionLoading, setActionLoading] = useState({});
  const toast = useToast();
  const [seenReminders, setSeenReminders] = useState({});
  const [offline, setOffline] = useState(false);
  
  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const reminderBgColor = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    reminders.forEach((rem) => {
      if (rem.status === 'pending' && !seenReminders[rem._id]) {
        // Show different notification for renewal reminders
        if (rem.type === 'renewal') {
          showNotification('Prescription Renewal Needed', {
            body: `${rem.medicationId?.name || 'Medication'} needs renewal. Please request a new prescription or contact your doctor.`,
            icon: '/icon-192x192.png',
          });
        } else {
          showNotification('Medication Reminder', {
            body: `${rem.medicationId?.name || 'Medication'} is scheduled for ${rem.scheduledTime ? new Date(rem.scheduledTime).toLocaleString() : ''}`,
            icon: '/icon-192x192.png',
          });
        }
        setSeenReminders((prev) => ({ ...prev, [rem._id]: true }));
      }
    });
  }, [reminders]);

  const handleAction = async (reminderId, status) => {
    setActionLoading((prev) => ({ ...prev, [reminderId]: true }));
    try {
      let data = { status };
      if (status === 'snoozed') data.snoozeMinutes = 10;

      const res = await axios.patch(`/api/reminders/${reminderId}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (status === 'snoozed') {
        toast({
          title: 'Reminder snoozed.',
          description: `Rescheduled for ${new Date(res.data.scheduledTime).toLocaleString()}`,
          status: 'info',
          duration: 3000,
        });
      } else {
        toast({
          title: `Reminder marked as ${status}.`,
          status: 'success',
          duration: 2000,
        });
      }
      fetchReminders();
    } catch (err) {
      toast({
        title: 'Action failed',
        description: err.message || 'Something went wrong',
        status: 'error',
        duration: 2000,
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [reminderId]: false }));
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box 
        borderRadius="xl" 
        overflow="hidden" 
        boxShadow="xl"
        bg={bgColor}
        p={6}
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Heading 
            as="h1" 
            size="xl" 
            color={headingColor}
            bgGradient="linear(to-r, brand.500, accent.500)" 
            bgClip="text"
            display="flex"
            alignItems="center"
          >
            <BellIcon mr={3} />
            Notification Center
          </Heading>
          
          <HStack spacing={4}>
            {offline && (
              <Badge 
                colorScheme="yellow" 
                py={2} 
                px={3} 
                borderRadius="full"
                display="flex"
                alignItems="center"
              >
                <WarningIcon mr={2} />
                Offline Mode
              </Badge>
            )}
            
            <Tooltip label="Refresh reminders">
              <IconButton 
                aria-label="Refresh" 
                icon={<RepeatIcon />} 
                onClick={fetchReminders} 
                colorScheme="brand"
                borderRadius="md"
                size="lg"
              />
            </Tooltip>
          </HStack>
        </Flex>
        
        {remindersError && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            {remindersError}
          </Alert>
        )}
        
        <Card bg={cardBgColor} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <Heading size="md" color={headingColor}>
              <Flex align="center">
                <TimeIcon mr={2} />
                Medication Reminders
              </Flex>
            </Heading>
          </CardHeader>
          
          <Divider borderColor={borderColor} />
          
          <CardBody>
            {remindersLoading ? (
              <Center py={10}>
                <VStack spacing={4}>
                  <Spinner size="xl" thickness="4px" speed="0.65s" color="brand.500" />
                  <Text color={textColor}>Loading your reminders...</Text>
                </VStack>
              </Center>
            ) : reminders.length === 0 ? (
              <Center py={10}>
                <VStack spacing={4}>
                  <InfoIcon boxSize={10} color="gray.400" />
                  <Text color={textColor} fontSize="lg">No reminders yet</Text>
                  <Text color={textColor} fontSize="sm">Your medication reminders will appear here</Text>
                </VStack>
              </Center>
            ) : (
              <VStack spacing={4} align="stretch">
                {reminders.map((rem) => (
                  <Card 
                    key={rem._id} 
                    variant="outline" 
                    borderColor={borderColor} 
                    bg={reminderBgColor}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <CardBody>
                      <Flex 
                        direction={{ base: 'column', md: 'row' }} 
                        justify="space-between" 
                        align={{ base: 'flex-start', md: 'center' }}
                        gap={4}
                      >
                        <Box>
                          <Flex align="center" mb={2}>
                            {/* Show different badge for renewal reminders */}
                            {rem.type === 'renewal' ? (
                              <Badge colorScheme="purple" borderRadius="full" px={3} py={1} mr={3}>
                                Renewal Needed
                              </Badge>
                            ) : (
                              <Badge colorScheme={statusColors[rem.status] || 'gray'} borderRadius="full" px={3} py={1} mr={3}>
                                {rem.status}
                              </Badge>
                            )}
                            <Heading size="md" color={headingColor}>
                              {rem.medicationId?.name || 'Medication'}
                            </Heading>
                          </Flex>
                          <HStack spacing={4} mb={2}>
                            <Flex align="center">
                              <TimeIcon mr={1} color="brand.500" />
                              <Text fontSize="sm" color={textColor}>
                                {rem.scheduledTimeLocal
                                  ? new Date(rem.scheduledTimeLocal).toLocaleString()
                                  : (rem.scheduledTime ? new Date(rem.scheduledTime).toLocaleString() : '-')}
                              </Text>
                            </Flex>
                            {rem.timezone && (
                              <Badge variant="subtle" colorScheme="blue">
                                {rem.timezone}
                              </Badge>
                            )}
                          </HStack>
                          {/* Show renewal message if renewal reminder */}
                          {rem.type === 'renewal' && (
                            <Text color="purple.600" fontWeight="semibold" fontSize="sm">
                              This medication is about to expire or has low refills. Please request a renewal.
                            </Text>
                          )}
                        </Box>
                        {/* Only show action buttons for medication reminders */}
                        {rem.type !== 'renewal' && (
                          <HStack spacing={3}>
                            <Tooltip label="Mark as taken">
                              <Button
                                leftIcon={<CheckIcon />}
                                colorScheme="green"
                                isLoading={actionLoading[rem._id]}
                                onClick={() => handleAction(rem._id, 'acknowledged')}
                                isDisabled={rem.status === 'acknowledged'}
                                size="sm"
                                borderRadius="md"
                              >
                                Taken
                              </Button>
                            </Tooltip>
                            <Tooltip label="Snooze for 10 minutes">
                              <Button
                                leftIcon={<TimeIcon />}
                                colorScheme="purple"
                                isLoading={actionLoading[rem._id]}
                                onClick={() => handleAction(rem._id, 'snoozed')}
                                isDisabled={rem.status === 'snoozed'}
                                size="sm"
                                borderRadius="md"
                              >
                                Snooze
                              </Button>
                            </Tooltip>
                            <Tooltip label="Mark as missed">
                              <Button
                                leftIcon={<CloseIcon />}
                                colorScheme="red"
                                isLoading={actionLoading[rem._id]}
                                onClick={() => handleAction(rem._id, 'missed')}
                                isDisabled={rem.status === 'missed'}
                                size="sm"
                                borderRadius="md"
                                variant="outline"
                              >
                                Missed
                              </Button>
                            </Tooltip>
                          </HStack>
                        )}
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </CardBody>
          
          {!remindersLoading && reminders.length > 0 && (
            <CardFooter>
              <Text color={textColor} fontSize="sm">
                Showing {reminders.length} reminder{reminders.length !== 1 ? 's' : ''}
              </Text>
            </CardFooter>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default NotificationCenter;
