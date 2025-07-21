import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Input, 
  Heading, 
  Alert, 
  AlertIcon,
  Image, 
  VStack, 
  HStack, 
  Text, 
  Select, 
  FormControl, 
  FormLabel,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputRightElement,
  Stack,
  useToast
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, AttachmentIcon, CheckIcon } from '@chakra-ui/icons';
import { getToken } from '../utils/token';

const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const UploadPrescription = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');
  const [scheduleType, setScheduleType] = useState('fixed');
  const [intervalHours, setIntervalHours] = useState('');
  const [customRules, setCustomRules] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeInput, setTimeInput] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [smartTimes, setSmartTimes] = useState([]);
  const [smartExplanation, setSmartExplanation] = useState('');
  const [smartLoading, setSmartLoading] = useState(false);
  const [showSmart, setShowSmart] = useState(false);
  
  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const toast = useToast();

  useEffect(() => {
    fetchMedicationsAndPrescriptions();
  }, []);

  const fetchMedicationsAndPrescriptions = async () => {
    try {
      const res = await axios.get('/api/medications', { headers: { Authorization: `Bearer ${getToken()}` } });
      const allPrescriptions = (res.data || []).map(med => ({
        medicationName: med.name,
        prescriptionImage: med.prescriptionDetails?.prescriptionImage,
        uploadedAt: med.createdAt,
      })).filter(p => p.prescriptionImage);
      setPrescriptions(allPrescriptions);
      setMedications(res.data || []);
    } catch (err) {
      setError('Failed to load prescriptions',err);
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMedicationChange = (e) => {
    setSelectedMedication(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      toast({
        title: 'No file selected',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!selectedMedication) {
      setError('Please select a medication');
      toast({
        title: 'No medication selected',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const formData = new FormData();
    formData.append('prescription', file);
    try {
      const res = await axios.post(`/api/upload?medicationId=${selectedMedication}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setMessage('Upload successful! URL: ' + res.data.url);
      setError('');
      setFile(null);
      setPrescriptions(prev => [
        ...prev,
        {
          medicationName: medications.find(m => m._id === selectedMedication)?.name || '',
          prescriptionImage: res.data.url,
          uploadedAt: new Date().toISOString(),
        },
      ]);
      toast({
        title: 'Upload successful',
        description: 'Prescription uploaded successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setMessage('');
      toast({
        title: 'Upload failed',
        description: err.response?.data?.message || 'Upload failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Medication creation
  const handleAddMedication = async (e) => {
    e.preventDefault();
    if (!medName || !medDosage || !medFrequency) {
      setError('Fill all medication fields');
      toast({
        title: 'Missing fields',
        description: 'Fill all medication fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    let schedule = { type: scheduleType, times: [], days: [], startDate: new Date(), endDate: new Date() };
    if (scheduleType === 'fixed') {
      schedule.days = selectedDays;
      schedule.times = selectedTimes;
    }
    if (scheduleType === 'interval') schedule.intervalHours = Number(intervalHours);
    if (scheduleType === 'custom' && customRules) try { schedule.customRules = JSON.parse(customRules); } catch { setError('Invalid custom rules JSON'); return; }
    const payload = {
      name: medName,
      dosage: medDosage,
      frequency: medFrequency,
      schedule,
      isActive: true,
    };
    console.log('Submitting medication payload:', payload);
    try {
      await axios.post('/api/medications', payload, { headers: { Authorization: `Bearer ${getToken()}` } });
      setMedName('');
      setMedDosage('');
      setMedFrequency('');
      setScheduleType('fixed');
      setIntervalHours('');
      setCustomRules('');
      setSelectedDays([]);
      setSelectedTimes([]);
      setTimeInput('');
      setError('');
      setMessage('Medication added!');
      fetchMedicationsAndPrescriptions();
      toast({
        title: 'Medication added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError('Failed to add medication', err);
      setMessage('');
      console.error('Medication add error:', err.response?.data || err);
      toast({
        title: 'Failed to add medication',
        description: err.response?.data?.message || err.message || 'Failed to add medication',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Add/remove days
  const handleDayChange = (day) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };
  // Add time
  const handleAddTime = () => {
    if (timeInput && !selectedTimes.includes(timeInput)) {
      setSelectedTimes([...selectedTimes, timeInput]);
      setTimeInput('');
    }
  };
  // Remove time
  const handleRemoveTime = (t) => {
    setSelectedTimes(selectedTimes.filter(time => time !== t));
  };

  const fetchSmartSchedule = async () => {
    setSmartLoading(true);
    try {
      const res = await axios.get('/api/analytics/smart-schedule', { headers: { Authorization: `Bearer ${getToken()}` } });
      setSmartTimes(res.data.recommended || []);
      setSmartExplanation(res.data.explanation || '');
      setShowSmart(true);
    } catch (err) {
      setSmartTimes([]);
      setSmartExplanation('');
      setShowSmart(false);
    } finally {
      setSmartLoading(false);
    }
  };

  // When schedule type is selected and user is about to pick times, fetch smart schedule
  useEffect(() => {
    if ((scheduleType === 'fixed' || scheduleType === 'custom') && activeTab === 0) {
      fetchSmartSchedule();
    } else {
      setShowSmart(false);
    }
    // eslint-disable-next-line
  }, [scheduleType, activeTab]);

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
          Prescription Management
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
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500', borderBottomColor: cardBgColor }}>Add Medication</Tab>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500', borderBottomColor: cardBgColor }}>Upload Prescription</Tab>
            <Tab _selected={{ color: 'brand.500', borderColor: 'brand.500', borderBottomColor: cardBgColor }}>View Prescriptions</Tab>
          </TabList>
          
          <TabPanels mt={4}>
            {/* Add Medication Tab */}
            <TabPanel p={0}>
              <Card bg={cardBgColor} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth="1px">
                <CardHeader>
                  <Heading size="md" color={headingColor}>Add New Medication</Heading>
                </CardHeader>
                
                <Divider borderColor={borderColor} />
                
                <CardBody>
                  <form onSubmit={handleAddMedication}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                      <FormControl>
                        <FormLabel color={textColor}>Medication Name</FormLabel>
                        <Input 
                          value={medName} 
                          onChange={e => setMedName(e.target.value)} 
                          placeholder="Enter medication name" 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel color={textColor}>Dosage</FormLabel>
                        <Input 
                          value={medDosage} 
                          onChange={e => setMedDosage(e.target.value)} 
                          placeholder="e.g., 10mg, 1 tablet" 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel color={textColor}>Frequency</FormLabel>
                        <Input 
                          value={medFrequency} 
                          onChange={e => setMedFrequency(e.target.value)} 
                          placeholder="e.g., Once daily, Twice daily" 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        />
                      </FormControl>
                    </SimpleGrid>
                    
                    <FormControl mb={6}>
                      <FormLabel color={textColor}>Schedule Type</FormLabel>
                      <Select 
                        value={scheduleType} 
                        onChange={e => setScheduleType(e.target.value)}
                        focusBorderColor="brand.500"
                        borderRadius="md"
                      >
                        <option value="fixed">Fixed Times/Days</option>
                        <option value="interval">Every X Hours</option>
                        <option value="custom">Custom (JSON)</option>
                      </Select>
                    </FormControl>
                    
                    {scheduleType === 'fixed' && (
                      <Stack spacing={6}>
                        <FormControl>
                          <FormLabel color={textColor}>Days of Week</FormLabel>
                          <SimpleGrid columns={{ base: 2, sm: 3, md: 7 }} spacing={3}>
                            {daysOfWeek.map(day => (
                              <Button
                                key={day}
                                size="sm"
                                variant={selectedDays.includes(day) ? "solid" : "outline"}
                                colorScheme={selectedDays.includes(day) ? "brand" : "gray"}
                                onClick={() => handleDayChange(day)}
                                borderRadius="md"
                              >
                                {day.substring(0, 3)}
                              </Button>
                            ))}
                          </SimpleGrid>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel color={textColor}>Medication Times</FormLabel>
                          <HStack mb={4}>
                            <Input
                              type="time"
                              value={timeInput}
                              onChange={e => setTimeInput(e.target.value)}
                              focusBorderColor="brand.500"
                              borderRadius="md"
                              maxW={{ base: "full", md: "200px" }}
                            />
                            <Tooltip label="Add Time">
                              <IconButton 
                                icon={<AddIcon />} 
                                onClick={handleAddTime} 
                                colorScheme="teal" 
                                aria-label="Add time"
                                borderRadius="md"
                              />
                            </Tooltip>
                          </HStack>
                          
                          {selectedTimes.length > 0 ? (
                            <Flex gap={2} flexWrap="wrap">
                              {selectedTimes.map(time => (
                                <Badge
                                  key={time}
                                  py={2}
                                  px={3}
                                  borderRadius="full"
                                  colorScheme="blue"
                                  display="flex"
                                  alignItems="center"
                                >
                                  <Text mr={2}>{time}</Text>
                                  <IconButton
                                    icon={<CloseIcon />}
                                    onClick={() => handleRemoveTime(time)}
                                    size="xs"
                                    colorScheme="blue"
                                    variant="ghost"
                                    aria-label="Remove time"
                                  />
                                </Badge>
                              ))}
                            </Flex>
                          ) : (
                            <Text color={textColor} fontSize="sm">
                              No times added yet. Please add at least one time.
                            </Text>
                          )}
                        </FormControl>
                        {showSmart && (
                          <Box mt={2} p={3} borderWidth={1} borderRadius="md" bg="blue.50">
                            <HStack mb={1}>
                              <Text fontWeight="bold">Recommended Times:</Text>
                              {smartLoading ? <Spinner size="sm" /> : smartTimes.length > 0 ? smartTimes.map((t, idx) => (
                                <Badge key={idx} colorScheme="blue">{t}</Badge>
                              )) : <Text>No strong patterns</Text>}
                            </HStack>
                            <Text fontSize="sm" color="gray.600">{smartExplanation}</Text>
                            {smartTimes.length > 0 && (
                              <Button size="xs" colorScheme="blue" mt={2} onClick={() => setSelectedTimes(smartTimes)}>
                                Auto-fill Times
                              </Button>
                            )}
                          </Box>
                        )}
                      </Stack>
                    )}
                    
                    {scheduleType === 'interval' && (
                      <FormControl mb={6}>
                        <FormLabel color={textColor}>Interval (hours)</FormLabel>
                        <Input 
                          type="number" 
                          value={intervalHours} 
                          onChange={e => setIntervalHours(e.target.value)} 
                          placeholder="e.g., 8 for every 8 hours" 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                          maxW={{ base: "full", md: "200px" }}
                        />
                      </FormControl>
                    )}
                    
                    {scheduleType === 'custom' && (
                      <FormControl mb={6}>
                        <FormLabel color={textColor}>Custom Rules (JSON)</FormLabel>
                        <Input 
                          value={customRules} 
                          onChange={e => setCustomRules(e.target.value)} 
                          placeholder='{"days":["Monday"],"times":["09:00"]}' 
                          focusBorderColor="brand.500"
                          borderRadius="md"
                          fontFamily="mono"
                        />
                      </FormControl>
                    )}
                    
                    <Button 
                      type="submit" 
                      mt={6} 
                      size="lg"
                      colorScheme="blue"
                      bgGradient="linear(to-r, brand.500, accent.500)"
                      _hover={{ 
                        bgGradient: "linear(to-r, brand.600, accent.600)", 
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 128, 255, 0.3)"
                      }}
                      width="full"
                      leftIcon={<AddIcon />}
                    >
                      Add Medication
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Upload Prescription Tab */}
            <TabPanel p={0}>
              <Card bg={cardBgColor} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth="1px">
                <CardHeader>
                  <Heading size="md" color={headingColor}>Upload Prescription</Heading>
                </CardHeader>
                
                <Divider borderColor={borderColor} />
                
                <CardBody>
      <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                      <FormControl>
                        <FormLabel color={textColor}>Select Medication</FormLabel>
                        <Select 
                          placeholder="Choose a medication" 
                          value={selectedMedication} 
                          onChange={handleMedicationChange}
                          focusBorderColor="brand.500"
                          borderRadius="md"
                        >
                          {medications.map(med => (
                            <option key={med._id} value={med._id}>{med.name}</option>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel color={textColor}>Upload Prescription Image</FormLabel>
                        <InputGroup>
                          <Input 
                            type="file" 
                            onChange={handleChange}
                            pt={1}
                            focusBorderColor="brand.500"
                            borderRadius="md"
                            accept="image/*"
                          />
                          <InputRightElement>
                            <AttachmentIcon color="gray.500" />
                          </InputRightElement>
                        </InputGroup>
                        <Text fontSize="sm" color={textColor} mt={2}>
                          Supported formats: JPG, PNG, PDF (max 5MB)
                        </Text>
                      </FormControl>
                      
                      <Button 
                        type="submit" 
                        mt={4} 
                        size="lg"
                        colorScheme="blue"
                        bgGradient="linear(to-r, brand.500, accent.500)"
                        _hover={{ 
                          bgGradient: "linear(to-r, brand.600, accent.600)", 
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0, 128, 255, 0.3)"
                        }}
                        width="full"
                        leftIcon={<AttachmentIcon />}
                        isDisabled={!file || !selectedMedication}
                      >
                        Upload Prescription
                      </Button>
                    </VStack>
      </form>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* View Prescriptions Tab */}
            <TabPanel p={0}>
              <Card bg={cardBgColor} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth="1px">
                <CardHeader>
                  <Heading size="md" color={headingColor}>Uploaded Prescriptions</Heading>
                </CardHeader>
                
                <Divider borderColor={borderColor} />
                
                <CardBody>
                  {prescriptions.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Text color={textColor} mb={4}>No prescriptions uploaded yet</Text>
                      <Button 
                        onClick={() => setActiveTab(1)} 
                        colorScheme="teal"
                        size="md"
                        leftIcon={<AttachmentIcon />}
                      >
                        Upload Your First Prescription
                      </Button>
                    </Box>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {prescriptions.map((prescription, idx) => (
                        <Card key={idx} variant="outline" borderColor={borderColor} overflow="hidden">
                          <Image 
                            src={prescription.prescriptionImage} 
                            alt="Prescription" 
                            objectFit="cover"
                            height="200px"
                          />
                          
                          <CardBody>
                            <Heading size="sm" mb={2} color={headingColor}>
                              {prescription.medicationName}
                            </Heading>
                            
                            <Text fontSize="sm" color={textColor}>
                              Uploaded: {new Date(prescription.uploadedAt).toLocaleString()}
                            </Text>
                          </CardBody>
                          
                          <CardFooter pt={0}>
                            <Button 
                              as="a" 
                              href={prescription.prescriptionImage} 
                              target="_blank"
                              size="sm" 
                              width="full"
                              colorScheme="blue"
                              variant="outline"
                            >
                              View Full Size
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </SimpleGrid>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
    </Box>
    </Container>
  );
};

export default UploadPrescription; 