import React, { useEffect, useState } from 'react';
import { fetchProfile, updateProfile, fetchDoctors, updateDoctors } from '../services/userService';
import { 
  Box, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  Heading, 
  Alert, 
  AlertIcon,
  VStack, 
  HStack, 
  Text,
  Container,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Badge,
  IconButton,
  Tooltip,
  useColorModeValue,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  AvatarBadge,
  Stack
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, EditIcon, CheckIcon } from '@chakra-ui/icons';
import timezones from '../utils/timezones';

const Profile = () => {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', dateOfBirth: '', allergies: [], conditions: [], emergencyContact: { name: '', phone: '', relation: '' } });
  const [doctors, setDoctors] = useState([{ name: '', contact: '', specialty: '' }]);
  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile({
          ...data,
          allergies: data.allergies || [],
          conditions: data.conditions || [],
          emergencyContact: data.emergencyContact || { name: '', phone: '', relation: '' },
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    const loadDoctors = async () => {
      try {
        const doctorsData = await fetchDoctors();
        setDoctors(doctorsData.length ? doctorsData : [{ name: '', contact: '', specialty: '' }]);
      } catch (err) {
        setError('Failed to load doctors');
      }
    };
    loadProfile();
    loadDoctors();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEmergencyContactChange = (e) => {
    setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, [e.target.name]: e.target.value } });
  };

  // Allergies
  const addAllergy = () => {
    if (allergyInput.trim()) {
      setProfile({ ...profile, allergies: [...profile.allergies, allergyInput.trim()] });
      setAllergyInput('');
    }
  };
  const removeAllergy = (idx) => {
    setProfile({ ...profile, allergies: profile.allergies.filter((_, i) => i !== idx) });
  };

  // Conditions
  const addCondition = () => {
    if (conditionInput.trim()) {
      setProfile({ ...profile, conditions: [...profile.conditions, conditionInput.trim()] });
      setConditionInput('');
    }
  };
  const removeCondition = (idx) => {
    setProfile({ ...profile, conditions: profile.conditions.filter((_, i) => i !== idx) });
  };

  const handleDoctorChange = (idx, e) => {
    const newDoctors = [...doctors];
    newDoctors[idx][e.target.name] = e.target.value;
    setDoctors(newDoctors);
  };

  const addDoctor = () => {
    setDoctors([...doctors, { name: '', contact: '', specialty: '' }]);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      setMessage('Profile updated!');
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      setMessage('');
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoctors(doctors);
      setMessage('Doctor contacts updated!');
      setError('');
    } catch (err) {
      setError('Failed to update doctor contacts');
      setMessage('');
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
        <Heading 
          as="h1" 
          size="xl" 
          mb={6} 
          color={headingColor}
          bgGradient="linear(to-r, brand.500, accent.500)" 
          bgClip="text"
        >
          My Profile
        </Heading>
        
        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        {message && (
          <Alert status="success" mb={4} borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}
        
        <Tabs 
          variant="enclosed" 
          colorScheme="brand" 
          index={activeTab} 
          onChange={setActiveTab}
          borderColor={borderColor}
          mb={6}
        >
          <TabList>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500', borderBottomColor: cardBgColor }}>Personal Information</Tab>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500', borderBottomColor: cardBgColor }}>Medical Details</Tab>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500', borderBottomColor: cardBgColor }}>Doctor Contacts</Tab>
          </TabList>
          
          <TabPanels mt={4}>
            {/* Personal Information Tab */}
            <TabPanel p={0}>
              <Card bg={cardBgColor} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth="1px">
                <CardHeader pb={2}>
                  <Flex align="center">
                    <Avatar size="lg" name={`${profile.firstName} ${profile.lastName}`} mr={4}>
                      <AvatarBadge boxSize="1.25em" bg="green.500" />
                    </Avatar>
                    <Box>
                      <Heading size="md" color={headingColor}>{profile.firstName} {profile.lastName}</Heading>
                      <Text color={textColor}>User Profile</Text>
                    </Box>
                  </Flex>
                </CardHeader>
                
                <Divider borderColor={borderColor} />
                
                <CardBody>
                  <form onSubmit={handleProfileSubmit}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl>
                        <FormLabel color={textColor}>First Name</FormLabel>
                        <Input 
                          name="firstName" 
                          value={profile.firstName || ''} 
                          onChange={handleProfileChange} 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel color={textColor}>Last Name</FormLabel>
                        <Input 
                          name="lastName" 
                          value={profile.lastName || ''} 
                          onChange={handleProfileChange} 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel color={textColor}>Date of Birth</FormLabel>
                        <Input 
                          name="dateOfBirth" 
                          type="date" 
                          value={profile.dateOfBirth ? profile.dateOfBirth.substring(0,10) : ''} 
                          onChange={handleProfileChange} 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel color={textColor}>Timezone</FormLabel>
                        <Select
                          name="timezone"
                          value={profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                          onChange={handleProfileChange}
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        >
                          {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                    
                    <Box mt={8}>
                      <Heading size="sm" mb={4} color={headingColor}>Emergency Contact</Heading>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <FormControl>
                          <FormLabel color={textColor}>Name</FormLabel>
                          <Input 
                            name="name" 
                            value={profile.emergencyContact.name || ''} 
                            onChange={handleEmergencyContactChange} 
                            placeholder="Contact Name" 
                            focusBorderColor="brand.500"
                            borderRadius="md"
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel color={textColor}>Phone</FormLabel>
                          <Input 
                            name="phone" 
                            value={profile.emergencyContact.phone || ''} 
                            onChange={handleEmergencyContactChange} 
                            placeholder="Contact Phone" 
                            focusBorderColor="brand.500"
                            borderRadius="md"
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel color={textColor}>Relation</FormLabel>
                          <Input 
                            name="relation" 
                            value={profile.emergencyContact.relation || ''} 
                            onChange={handleEmergencyContactChange} 
                            placeholder="Relationship" 
                            focusBorderColor="brand.500"
                            borderRadius="md"
                          />
                        </FormControl>
                      </SimpleGrid>
                    </Box>
                    
                    <Button 
                      type="submit" 
                      mt={8} 
                      size="lg"
                      colorScheme="blue"
                      bgGradient="linear(to-r, brand.500, accent.500)"
                      _hover={{ 
                        bgGradient: "linear(to-r, brand.600, accent.600)", 
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 128, 255, 0.3)"
                      }}
                      width="full"
                    >
                      Update Profile
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Medical Details Tab */}
            <TabPanel p={0}>
              <Card bg={cardBgColor} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth="1px">
                <CardHeader>
                  <Heading size="md" color={headingColor}>Medical Information</Heading>
                </CardHeader>
                
                <Divider borderColor={borderColor} />
                
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    {/* Allergies Section */}
                    <Box>
                      <Heading size="sm" mb={4} color={headingColor}>Allergies</Heading>
                      <HStack mb={4}>
                        <Input 
                          value={allergyInput} 
                          onChange={e => setAllergyInput(e.target.value)} 
                          placeholder="Add allergy" 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        />
                        <Tooltip label="Add Allergy">
                          <IconButton 
                            icon={<AddIcon />} 
                            onClick={addAllergy} 
                            colorScheme="teal" 
                            aria-label="Add allergy"
                            borderRadius="md"
                          />
                        </Tooltip>
                      </HStack>
                      
                      {profile.allergies && profile.allergies.length > 0 ? (
                        <VStack align="stretch" spacing={2}>
                          {profile.allergies.map((allergy, idx) => (
                            <Flex 
                              key={idx} 
                              justify="space-between" 
                              align="center" 
                              p={2} 
                              borderWidth="1px" 
                              borderRadius="md" 
                              borderColor={borderColor}
                            >
                              <Text color={textColor}>{allergy}</Text>
                              <IconButton
                                icon={<CloseIcon />}
                                onClick={() => removeAllergy(idx)}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Remove allergy"
                              />
                            </Flex>
                          ))}
                        </VStack>
                      ) : (
                        <Text color={textColor} textAlign="center" py={4}>
                          No allergies added yet
                        </Text>
                      )}
                    </Box>
                    
                    {/* Medical Conditions Section */}
                    <Box>
                      <Heading size="sm" mb={4} color={headingColor}>Medical Conditions</Heading>
                      <HStack mb={4}>
                        <Input 
                          value={conditionInput} 
                          onChange={e => setConditionInput(e.target.value)} 
                          placeholder="Add condition" 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        />
                        <Tooltip label="Add Condition">
                          <IconButton 
                            icon={<AddIcon />} 
                            onClick={addCondition} 
                            colorScheme="teal" 
                            aria-label="Add condition"
                            borderRadius="md"
                          />
                        </Tooltip>
                      </HStack>
                      
                      {profile.conditions && profile.conditions.length > 0 ? (
                        <VStack align="stretch" spacing={2}>
                          {profile.conditions.map((condition, idx) => (
                            <Flex 
                              key={idx} 
                              justify="space-between" 
                              align="center" 
                              p={2} 
                              borderWidth="1px" 
                              borderRadius="md" 
                              borderColor={borderColor}
                            >
                              <Text color={textColor}>{condition}</Text>
                              <IconButton
                                icon={<CloseIcon />}
                                onClick={() => removeCondition(idx)}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Remove condition"
                              />
                            </Flex>
                          ))}
                        </VStack>
                      ) : (
                        <Text color={textColor} textAlign="center" py={4}>
                          No medical conditions added yet
                        </Text>
                      )}
                    </Box>
                  </SimpleGrid>
                  
                  <Button 
                    type="button" 
                    onClick={handleProfileSubmit}
                    mt={8} 
                    size="lg"
                    colorScheme="blue"
                    bgGradient="linear(to-r, brand.500, accent.500)"
                    _hover={{ 
                      bgGradient: "linear(to-r, brand.600, accent.600)", 
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0, 128, 255, 0.3)"
                    }}
                    width="full"
                  >
                    Save Medical Information
                  </Button>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Doctor Contacts Tab */}
            <TabPanel p={0}>
              <Card bg={cardBgColor} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth="1px">
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" color={headingColor}>Doctor Contacts</Heading>
                    <Button 
                      leftIcon={<AddIcon />} 
                      onClick={addDoctor} 
                      colorScheme="teal" 
                      variant="outline"
                      size="sm"
                      borderRadius="md"
                    >
                      Add New Doctor
                    </Button>
                  </Flex>
                </CardHeader>
                
                <Divider borderColor={borderColor} />
                
                <CardBody>
                  <form onSubmit={handleDoctorSubmit}>
                    {doctors.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {doctors.map((doc, idx) => (
                          <Card key={idx} variant="outline" borderColor={borderColor} borderRadius="md">
                            <CardHeader pb={2}>
                              <Flex justify="space-between" align="center">
                                <Heading size="sm" color={headingColor}>
                                  {doc.name ? doc.name : `Doctor #${idx + 1}`}
                                </Heading>
                                {doc.specialty && (
                                  <Badge colorScheme="purple" borderRadius="full" px={2}>
                                    {doc.specialty}
                                  </Badge>
                                )}
                              </Flex>
                            </CardHeader>
                            
                            <CardBody pt={2}>
                              <SimpleGrid columns={1} spacing={4}>
                                <FormControl>
                                  <FormLabel color={textColor}>Name</FormLabel>
                                  <Input 
                                    name="name" 
                                    value={doc.name} 
                                    onChange={e => handleDoctorChange(idx, e)} 
                                    focusBorderColor="brand.500"
                                    borderRadius="md"
                                  />
                                </FormControl>
                                
                                <FormControl>
                                  <FormLabel color={textColor}>Contact</FormLabel>
                                  <Input 
                                    name="contact" 
                                    value={doc.contact} 
                                    onChange={e => handleDoctorChange(idx, e)} 
                                    focusBorderColor="brand.500"
                                    borderRadius="md"
                                  />
                                </FormControl>
                                
                                <FormControl>
                                  <FormLabel color={textColor}>Specialty</FormLabel>
                                  <Input 
                                    name="specialty" 
                                    value={doc.specialty} 
                                    onChange={e => handleDoctorChange(idx, e)} 
                                    focusBorderColor="brand.500"
                                    borderRadius="md"
                                  />
                                </FormControl>
                              </SimpleGrid>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box textAlign="center" py={8}>
                        <Text color={textColor} mb={4}>No doctor contacts added yet</Text>
                        <Button 
                          leftIcon={<AddIcon />} 
                          onClick={addDoctor} 
                          colorScheme="teal"
                          size="md"
                        >
                          Add Your First Doctor
                        </Button>
                      </Box>
                    )}
                    
                    {doctors.length > 0 && (
                      <Button 
                        type="submit" 
                        mt={8} 
                        size="lg"
                        colorScheme="blue"
                        bgGradient="linear(to-r, brand.500, accent.500)"
                        _hover={{ 
                          bgGradient: "linear(to-r, brand.600, accent.600)", 
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0, 128, 255, 0.3)"
                        }}
                        width="full"
                      >
                        Save Doctor Contacts
                      </Button>
                    )}
                  </form>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Profile;