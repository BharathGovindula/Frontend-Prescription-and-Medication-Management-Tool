import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Switch, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  Alert, 
  AlertIcon,
  VStack, 
  Container,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Select,
  useColorModeValue,
  Tooltip,
  IconButton,
  Flex,
  Text,
  HStack
} from '@chakra-ui/react';
import { InfoIcon, BellIcon, EmailIcon, SettingsIcon } from '@chakra-ui/icons';

const PREF_KEY = 'notificationPreferences';

const soundOptions = [
  { label: 'Chime (Default)', value: 'notification-chime.mp3' },
  { label: 'Beep', value: 'notification-beep.mp3' },
];

const defaultPrefs = {
  push: true,
  email: false,
  sound: true,
  soundFile: 'notification-chime.mp3',
  snoozeMinutes: 10,
};

const NotificationPreferences = () => {
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [message, setMessage] = useState('');
  
  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    const stored = localStorage.getItem(PREF_KEY);
    if (stored) setPrefs(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPrefs((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    setMessage('Preferences saved!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleTestSound = () => {
    const audio = new Audio(`/${prefs.soundFile || 'notification-chime.mp3'}`);
    audio.play();
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
        <Heading 
          as="h1" 
          size="xl" 
          mb={6} 
          color={headingColor}
          bgGradient="linear(to-r, brand.500, accent.500)" 
          bgClip="text"
          display="flex"
          alignItems="center"
        >
          <BellIcon mr={3} />
          Notification Preferences
        </Heading>
        
        {message && (
          <Alert status="success" mb={6} borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}
        
        <Card bg={cardBgColor} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <Heading size="md" color={headingColor}>
              <Flex align="center">
                <SettingsIcon mr={2} />
                Notification Settings
              </Flex>
            </Heading>
          </CardHeader>
          
          <Divider borderColor={borderColor} />
          
          <CardBody>
            <VStack spacing={6} align="stretch">
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <Flex align="center">
                  <BellIcon mr={2} color="brand.500" />
                  <FormLabel htmlFor="push" mb="0" color={textColor}>Push Notifications</FormLabel>
                  <Tooltip label="Receive notifications on this device">
                    <InfoIcon ml={1} color="gray.500" />
                  </Tooltip>
                </Flex>
                <Switch 
                  id="push" 
                  name="push" 
                  isChecked={prefs.push} 
                  onChange={handleChange} 
                  colorScheme="brand"
                  size="lg"
                />
              </FormControl>
              
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <Flex align="center">
                  <EmailIcon mr={2} color="brand.500" />
                  <FormLabel htmlFor="email" mb="0" color={textColor}>Email Notifications</FormLabel>
                  <Tooltip label="Receive notifications via email">
                    <InfoIcon ml={1} color="gray.500" />
                  </Tooltip>
                </Flex>
                <Switch 
                  id="email" 
                  name="email" 
                  isChecked={prefs.email} 
                  onChange={handleChange} 
                  colorScheme="brand"
                  size="lg"
                />
              </FormControl>
              
              <FormControl display="flex" justifyContent="space-between" alignItems="center">
                <Flex align="center">
                  <SettingsIcon mr={2} color="brand.500" />
                  <FormLabel htmlFor="sound" mb="0" color={textColor}>Notification Sound</FormLabel>
                  <Tooltip label="Play sound when notifications arrive">
                    <InfoIcon ml={1} color="gray.500" />
                  </Tooltip>
                </Flex>
                <Switch 
                  id="sound" 
                  name="sound" 
                  isChecked={prefs.sound} 
                  onChange={handleChange} 
                  colorScheme="brand"
                  size="lg"
                />
              </FormControl>
              
              <Divider borderColor={borderColor} />
              
              <FormControl>
                <FormLabel htmlFor="soundFile" color={textColor} fontWeight="medium">Sound Selection</FormLabel>
                <HStack spacing={4}>
                  <Select
                    id="soundFile"
                    name="soundFile"
                    value={prefs.soundFile}
                    onChange={handleChange}
                    focusBorderColor="brand.500"
                    borderRadius="md"
                    maxW="300px"
                  >
                    {soundOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                  <Tooltip label="Test selected sound">
                    <Button 
                      onClick={handleTestSound} 
                      colorScheme="teal"
                      leftIcon={<BellIcon />}
                      borderRadius="md"
                    >
                      Test Sound
                    </Button>
                  </Tooltip>
                </HStack>
              </FormControl>
              
              <FormControl>
                <FormLabel htmlFor="snoozeMinutes" color={textColor} fontWeight="medium">
                  Default Snooze Duration (minutes)
                </FormLabel>
                <Input 
                  id="snoozeMinutes" 
                  name="snoozeMinutes" 
                  type="number" 
                  value={prefs.snoozeMinutes} 
                  onChange={handleChange} 
                  min={1} 
                  max={60} 
                  focusBorderColor="brand.500"
                  borderRadius="md"
                  maxW="200px"
                />
                <Text fontSize="sm" color={textColor} mt={1}>
                  Set how long notifications will be snoozed by default
                </Text>
              </FormControl>
            </VStack>
          </CardBody>
          
          <CardFooter>
            <Button 
              onClick={handleSave} 
              size="lg"
              colorScheme="blue"
              bgGradient="linear(to-r, brand.500, accent.500)"
              _hover={{ 
                bgGradient: "linear(to-r, brand.600, accent.600)", 
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 128, 255, 0.3)"
              }}
              width="full"
              leftIcon={<SettingsIcon />}
            >
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </Box>
    </Container>
  );
};

export default NotificationPreferences;