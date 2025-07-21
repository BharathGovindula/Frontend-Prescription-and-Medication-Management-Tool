import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon, Select, Input, Button, HStack, VStack, Badge, Stat, StatLabel, StatNumber, StatHelpText, Container, Flex, AlertTitle, SimpleGrid, Tooltip
} from '@chakra-ui/react';
import { getToken } from '../utils/token';
import jsPDF from 'jspdf';
import { FaShareAlt, FaClock, FaCalendarAlt, FaLightbulb, FaChartPie, FaFileCsv, FaFilePdf, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
import { SearchIcon, CheckIcon } from '@chakra-ui/icons';
import Confetti from 'react-confetti';
import { useToast } from '@chakra-ui/react';

function exportLogsToCSV(logs) {
  if (!logs.length) {
    toast({
      title: 'No logs to export',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });
    return;
  }
  try {
    const replacer = (key, value) => (value === null ? '' : value);
    const header = Object.keys(logs[0]);
    const csv = [
      header.join(','),
      ...logs.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')),
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medication_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: 'Logs exported as CSV',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  } catch (err) {
    toast({
      title: 'Failed to export CSV',
      description: err.message || 'Export failed',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  }
}

function exportLogsToPDF(logs) {
  if (!logs.length) {
    toast({
      title: 'No logs to export',
      status: 'warning',
      duration: 2000,
      isClosable: true,
    });
    return;
  }
  try {
    const doc = new jsPDF();
    const header = Object.keys(logs[0]);
    let y = 10;
    doc.text('Medication Logs', 10, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(header.join(' | '), 10, y);
    y += 7;
    logs.forEach(row => {
      doc.text(header.map(h => String(row[h])).join(' | '), 10, y);
      y += 7;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save('medication_logs.pdf');
    toast({
      title: 'Logs exported as PDF',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  } catch (err) {
    toast({
      title: 'Failed to export PDF',
      description: err.message || 'Export failed',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  }
}

const statusColors = {
  taken: 'green',
  missed: 'red',
  skipped: 'yellow',
};

const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [medications, setMedications] = useState([]);
  const [filters, setFilters] = useState({ medicationId: '', status: '', startDate: '', endDate: '' });
  const [summary, setSummary] = useState({ taken: 0, missed: 0, skipped: 0, total: 0, adherence: 0 });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState('');
  const [predictiveSuggestions, setPredictiveSuggestions] = useState([]);
  const [predictiveLoading, setPredictiveLoading] = useState(true);
  const [predictiveError, setPredictiveError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchMedications();
    fetchLogs();
    fetchAiAnalysis();
    fetchPredictiveSuggestions();
    fetchSuggestions();
  }, []);

  // Show confetti if adherence is 100%
  useEffect(() => {
    if (aiAnalysis && aiAnalysis.adherencePercent === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast({ title: 'Perfect Adherence!', description: 'You achieved 100% adherence!', status: 'success', duration: 4000, isClosable: true });
    }
  }, [aiAnalysis]);

  // Share handler
  const handleShare = () => {
    const text = `My medication adherence: ${aiAnalysis?.adherencePercent || 0}%\n${aiAnalysis?.summary || ''}`;
    if (navigator.share) {
      navigator.share({ title: 'My Medication Adherence', text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copied!', description: 'Adherence summary copied to clipboard.', status: 'info', duration: 2000, isClosable: true });
    }
  };

  // Google Calendar integration
  const addToGoogleCalendar = (suggestion) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0); // Default 8:00 AM
    const end = new Date(start.getTime() + 30 * 60000); // 30 min event
    const details = encodeURIComponent(suggestion.text);
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=Medication+Reminder&details=${details}&dates=${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    window.open(url, '_blank');
  };

  const fetchMedications = async () => {
    try {
      const res = await axios.get('/api/medications', { headers: { Authorization: `Bearer ${getToken()}` } });
      setMedications(res.data || []);
    } catch (err) {
      // ignore
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.medicationId) params.medicationId = filters.medicationId;
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await axios.get('/api/analytics/logs', { params, headers: { Authorization: `Bearer ${getToken()}` } });
      setLogs(res.data || []);
      summarize(res.data || []);
    } catch (err) {
      setError('Failed to load logs');
      toast({
        title: 'Failed to load logs',
        description: err.message || 'Failed to load logs',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAiAnalysis = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await axios.get('/api/analytics/ai-adherence', { headers: { Authorization: `Bearer ${getToken()}` } });
      setAiAnalysis(res.data);
    } catch (err) {
      setAiError('Failed to load AI adherence analysis');
      toast({
        title: 'Failed to load AI adherence analysis',
        description: err.message || 'Failed to load AI adherence analysis',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setAiLoading(false);
    }
  };

  const fetchPredictiveSuggestions = async () => {
    setPredictiveLoading(true);
    setPredictiveError('');
    try {
      const res = await axios.get('/api/analytics/predictive-reminder', { headers: { Authorization: `Bearer ${getToken()}` } });
      setPredictiveSuggestions(res.data.suggestions || []);
    } catch (err) {
      setPredictiveError('Failed to load predictive reminder suggestions');
      toast({
        title: 'Failed to load predictive reminder suggestions',
        description: err.message || 'Failed to load predictive reminder suggestions',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setPredictiveLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    setSuggestionsError('');
    try {
      const res = await axios.get('/api/analytics/suggestions', { headers: { Authorization: `Bearer ${getToken()}` } });
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      setSuggestionsError('Failed to load personalized suggestions');
      toast({
        title: 'Failed to load personalized suggestions',
        description: err.message || 'Failed to load personalized suggestions',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const summarize = (logs) => {
    const total = logs.length;
    const taken = logs.filter(l => l.status === 'taken').length;
    const missed = logs.filter(l => l.status === 'missed').length;
    const skipped = logs.filter(l => l.status === 'skipped').length;
    const adherence = total > 0 ? Math.round((taken / total) * 100) : 0;
    setSummary({ taken, missed, skipped, total, adherence });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box 
        borderRadius="xl" 
        boxShadow="2xl" 
        bg="white" 
        p={6}
        backgroundImage="linear-gradient(to right, rgba(255,255,255,0.97), rgba(255,255,255,0.97)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, #0080ff, #00ffbb)',
          zIndex: 1
        }}
      >
        <Heading 
          as="h1" 
          size="xl" 
          mb={6} 
          bgGradient="linear(to-r, brand.500, accent.500)" 
          bgClip="text"
          display="flex"
          alignItems="center"
          position="relative"
          _after={{
            content: '""',
            display: 'block',
            width: '50px',
            height: '3px',
            bgGradient: 'linear(to-r, brand.500, accent.500)',
            position: 'absolute',
            bottom: '-10px',
            left: '0'
          }}
        >
          Detailed Reports
        </Heading>
        <Box mb={8}>
          <Box 
            mb={6} 
            p={5} 
            borderRadius="lg" 
            boxShadow="md" 
            bg="white"
            border="1px solid"
            borderColor="gray.100"
          >
            <Heading 
              as="h3" 
              size="md" 
              mb={4} 
              display="flex"
              alignItems="center"
              color="gray.700"
            >
              <SearchIcon mr={2} /> Filter Reports
            </Heading>
            <form onSubmit={handleFilter}>
              <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4} mb={4}>
                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.600">Medication</Text>
                  <Select 
                    name="medicationId" 
                    value={filters.medicationId} 
                    onChange={handleFilterChange} 
                    placeholder="All Medications"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #0080ff' }}
                  >
                    {medications.map(med => (
                      <option key={med._id} value={med._id}>{med.name} ({med.dosage})</option>
                    ))}
                  </Select>
                </Box>
                
                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.600">Status</Text>
                  <Select 
                    name="status" 
                    value={filters.status} 
                    onChange={handleFilterChange} 
                    placeholder="All Statuses"
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #0080ff' }}
                  >
                    <option value="taken">Taken</option>
                    <option value="missed">Missed</option>
                    <option value="skipped">Skipped</option>
                  </Select>
                </Box>
                
                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.600">Start Date</Text>
                  <Input 
                    type="date" 
                    name="startDate" 
                    value={filters.startDate} 
                    onChange={handleFilterChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #0080ff' }}
                  />
                </Box>
                
                <Box>
                  <Text mb={2} fontWeight="medium" fontSize="sm" color="gray.600">End Date</Text>
                  <Input 
                    type="date" 
                    name="endDate" 
                    value={filters.endDate} 
                    onChange={handleFilterChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #0080ff' }}
                  />
                </Box>
                
                <Box alignSelf="flex-end">
                  <Button 
                    type="submit" 
                    colorScheme="blue" 
                    width="full"
                    height="40px"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    Apply Filters
                  </Button>
                </Box>
              </SimpleGrid>
              
              <HStack spacing={4} justify="flex-end">
                <Button 
                  leftIcon={<FaShareAlt />} 
                  colorScheme="purple" 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportLogsToCSV(logs)}
                >
                  Export to CSV
                </Button>
                <Button 
                  leftIcon={<FaShareAlt />} 
                  colorScheme="teal" 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportLogsToPDF(logs)}
                >
                  Export to PDF
                </Button>
              </HStack>
            </form>
          </Box>
          {/* AI Adherence Analysis Section */}
          <Box mb={8}>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={150} />}
            <Heading 
              as="h2" 
              size="lg" 
              mb={4} 
              display="flex"
              alignItems="center"
              color="brand.600"
            >
              <Box 
                bg="brand.50" 
                p={2} 
                borderRadius="full" 
                mr={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FaLightbulb color="#0080ff" />
              </Box>
              AI-Powered Adherence Analysis
            </Heading>
            {aiLoading ? (
              <Flex justify="center" p={6}>
                <Spinner size="xl" thickness="4px" color="brand.500" />
              </Flex>
            ) : aiError ? (
              <Alert status="error" variant="left-accent" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                {aiError}
              </Alert>
            ) : aiAnalysis ? (
              <Box 
                p={6} 
                borderRadius="lg" 
                bg={aiAnalysis.riskLevel === 'at risk' ? 'red.50' : 'green.50'}
                boxShadow="md"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: aiAnalysis.riskLevel === 'at risk' ? 'red.500' : 'green.500',
                }}
              >
                <Flex 
                  direction={{ base: 'column', md: 'row' }}
                  justify="space-between"
                  align={{ base: 'flex-start', md: 'center' }}
                  mb={4}
                >
                  <HStack mb={{ base: 2, md: 0 }} align="center">
                    <Box 
                      borderRadius="full" 
                      bg={aiAnalysis.adherencePercent >= 95 ? 'green.100' : aiAnalysis.adherencePercent >= 80 ? 'yellow.100' : 'red.100'} 
                      p={2}
                      mr={2}
                    >
                      {aiAnalysis.adherencePercent >= 95 ? 
                        <span role="img" aria-label="excellent" style={{ fontSize: '24px' }}>🟢</span> : 
                        aiAnalysis.adherencePercent >= 80 ? 
                        <span role="img" aria-label="good" style={{ fontSize: '24px' }}>🟡</span> : 
                        <span role="img" aria-label="risk" style={{ fontSize: '24px' }}>🔴</span>
                      }
                    </Box>
                    {aiAnalysis.summary && (
                      <Text 
                        mb={0} 
                        fontStyle="italic" 
                        fontSize="lg"
                        color={aiAnalysis.adherencePercent >= 95 ? 'green.700' : aiAnalysis.riskLevel === 'at risk' ? 'red.700' : 'yellow.700'} 
                        fontWeight="bold"
                      >
                        {aiAnalysis.summary.replace('Excellent adherence!', 'Excellent adherence!').replace('Good job!', 'Good job!').replace('at risk', 'at risk')}
                      </Text>
                    )}
                  </HStack>
                  <Button 
                    leftIcon={<FaShareAlt />} 
                    colorScheme="blue" 
                    onClick={handleShare} 
                    variant="solid"
                    size="md"
                    boxShadow="sm"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    Share Results
                  </Button>
                </Flex>
                
                <Flex 
                  direction={{ base: 'column', md: 'row' }}
                  justify="space-between"
                  bg={aiAnalysis.riskLevel === 'at risk' ? 'red.100' : 'green.100'}
                  p={4}
                  borderRadius="md"
                  mb={4}
                >
                  <HStack mb={{ base: 2, md: 0 }}>
                    <Text fontWeight="bold">Risk Level:</Text>
                    <Badge 
                      colorScheme={aiAnalysis.riskLevel === 'at risk' ? 'red' : 'green'}
                      fontSize="md"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {aiAnalysis.riskLevel}
                    </Badge>
                  </HStack>
                  
                  <HStack>
                    <Text fontWeight="bold">Adherence:</Text>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold" 
                      color={aiAnalysis.adherencePercent >= 95 ? 'green.600' : aiAnalysis.adherencePercent >= 80 ? 'yellow.600' : 'red.600'}
                    >
                      {aiAnalysis.adherencePercent}%
                    </Text>
                  </HStack>
                </Flex>
                
                {aiAnalysis.reasons && aiAnalysis.reasons.length > 0 && (
                  <Box 
                    mt={4} 
                    p={4} 
                    borderRadius="md" 
                    bg="white" 
                    boxShadow="sm"
                  >
                    <Text fontWeight="bold" fontSize="md" mb={2} color="gray.700">
                      <FaLightbulb style={{ display: 'inline', marginRight: '8px' }} /> Insights:
                    </Text>
                    <VStack align="start" spacing={2} mt={2}>
                      {aiAnalysis.reasons.map((reason, idx) => (
                        <HStack key={idx} align="start" spacing={2}>
                          <Box color="brand.500" mt={1}>•</Box>
                          <Text fontSize="md">{reason}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
            ) : null}
          </Box>
          {/* End AI Adherence Analysis Section */}
          {/* Predictive Reminder Suggestions Section */}
          <Box mb={8}>
            <Heading 
              as="h2" 
              size="lg" 
              mb={4} 
              display="flex"
              alignItems="center"
              color="blue.600"
            >
              <Box 
                bg="blue.50" 
                p={2} 
                borderRadius="full" 
                mr={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FaClock color="#3182CE" />
              </Box>
              Predictive Reminder Adjustments
            </Heading>
            
            {predictiveLoading ? (
              <Flex justify="center" p={6}>
                <Spinner size="xl" thickness="4px" color="blue.500" />
              </Flex>
            ) : predictiveError ? (
              <Alert status="error" variant="left-accent" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                {predictiveError}
              </Alert>
            ) : predictiveSuggestions.length > 0 ? (
              <Box
                p={6}
                borderRadius="lg"
                bg="blue.50"
                boxShadow="md"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: 'blue.500',
                }}
              >
                <Text mb={4} fontStyle="italic" color="blue.700">
                  Based on your medication history, we suggest the following adjustments to your reminder schedule:
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {predictiveSuggestions.map((s, idx) => (
                    <Box 
                      key={idx} 
                      p={4} 
                      borderRadius="md" 
                      bg="white" 
                      boxShadow="sm"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                      transition="all 0.2s"
                      position="relative"
                      overflow="hidden"
                      _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        background: 'blue.400',
                      }}
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontWeight="bold" color="blue.700">{s.medication?.name || 'Medication'}</Text>
                        <Badge colorScheme="blue" borderRadius="full" px={2}>{s.medication?.dosage || ''}</Badge>
                      </Flex>
                      <Text fontSize="md">{s.suggestion}</Text>
                      <Flex justify="flex-end" mt={3}>
                        <Button 
                          size="sm" 
                          leftIcon={<FaCalendarAlt />} 
                          colorScheme="blue" 
                          variant="outline"
                          onClick={() => addToGoogleCalendar(s)}
                        >
                          Add to Calendar
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ) : (
              <Box 
                p={6} 
                borderRadius="lg" 
                bg="green.50" 
                boxShadow="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box 
                  bg="green.100" 
                  p={3} 
                  borderRadius="full" 
                  mb={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CheckIcon boxSize={6} color="green.500" />
                </Box>
                <Text color="green.700" fontSize="lg" fontWeight="medium" textAlign="center">
                  No predictive adjustments needed. Your reminders are well-timed!
                </Text>
              </Box>
            )}
          </Box>
          {/* End Predictive Reminder Suggestions Section */}
          {/* Personalized Suggestions Section */}
          <Box 
            mb={8} 
            p={5} 
            borderRadius="lg" 
            boxShadow="xl" 
            bg="white"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'linear-gradient(180deg, #805AD5, #4299E1)',
            }}
          >
            <Heading 
              as="h2" 
              size="md" 
              mb={4} 
              display="flex"
              alignItems="center"
              color="purple.700"
            >
              <Box 
                bg="purple.50" 
                p={2} 
                borderRadius="full" 
                mr={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FaLightbulb color="#805AD5" />
              </Box>
              Personalized Suggestions
            </Heading>
            
            {suggestionsLoading ? (
              <Flex justify="center" p={6}>
                <Spinner size="xl" thickness="4px" color="purple.500" />
              </Flex>
            ) : suggestionsError ? (
              <Alert status="error" variant="left-accent" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                {suggestionsError}
              </Alert>
            ) : suggestions.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {suggestions.map((s, idx) => (
                  <Box 
                    key={idx} 
                    p={4} 
                    borderRadius="lg" 
                    bg={s.type === 'timing' ? 'yellow.50' : s.type === 'routine' ? 'blue.50' : 'purple.50'} 
                    boxShadow="md"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.3s"
                    position="relative"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      background: s.type === 'timing' ? 'yellow.400' : s.type === 'routine' ? 'blue.400' : 'purple.400',
                    }}
                  >
                    <Flex mb={3} align="center">
                      <Box 
                        p={2} 
                        borderRadius="full" 
                        bg={s.type === 'timing' ? 'yellow.100' : s.type === 'routine' ? 'blue.100' : 'purple.100'}
                        mr={3}
                      >
                        {s.type === 'timing' && <FaClock color="#D69E2E" />}
                        {s.type === 'routine' && <FaCalendarAlt color="#3182CE" />}
                        {s.type === 'general' && <FaLightbulb color="#805AD5" />}
                      </Box>
                      <Text 
                        fontWeight="bold" 
                        color={s.type === 'timing' ? 'yellow.700' : s.type === 'routine' ? 'blue.700' : 'purple.700'}
                      >
                        {s.type === 'timing' ? 'Timing Suggestion' : s.type === 'routine' ? 'Routine Suggestion' : 'General Tip'}
                      </Text>
                    </Flex>
                    
                    <Text fontSize="md" mb={4} pl={2} borderLeft="2px solid" borderColor={s.type === 'timing' ? 'yellow.300' : s.type === 'routine' ? 'blue.300' : 'purple.300'}>
                      {s.text}
                    </Text>
                    
                    {(s.type === 'timing' || s.type === 'routine') && (
                      <Flex justify="flex-end">
                        <Button 
                          leftIcon={<FaCalendarAlt />} 
                          colorScheme={s.type === 'timing' ? 'yellow' : 'blue'} 
                          size="sm" 
                          variant="outline" 
                          onClick={() => addToGoogleCalendar(s)}
                          _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
                          transition="all 0.2s"
                        >
                          Add to Calendar
                        </Button>
                      </Flex>
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Box 
                p={6} 
                borderRadius="lg" 
                bg="green.50" 
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                textAlign="center"
              >
                <Box 
                  bg="green.100" 
                  p={3} 
                  borderRadius="full" 
                  mb={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CheckIcon boxSize={6} color="green.500" />
                </Box>
                <Text color="green.700" fontSize="lg" fontWeight="medium">
                  No suggestions at this time. Keep up the good work!
                </Text>
              </Box>
            )}
          </Box>
          {/* End Personalized Suggestions Section */}
          <Box 
            mb={8} 
            p={5} 
            borderRadius="lg" 
            boxShadow="xl" 
            bg="white"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #0080ff, #00bfff)',
            }}
          >
            <Heading 
              as="h3" 
              size="md" 
              mb={4} 
              display="flex"
              alignItems="center"
              color="gray.700"
            >
              <FaChartPie mr={2} /> Medication Summary
            </Heading>
            
            <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={6}>
              <Box 
                p={4} 
                borderRadius="lg" 
                bg="gray.50" 
                boxShadow="md"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.3s"
                textAlign="center"
              >
                <Text fontSize="sm" fontWeight="medium" color="gray.500" mb={1}>TOTAL</Text>
                <Text fontSize="3xl" fontWeight="bold" color="gray.700">{summary.total}</Text>
                <Text fontSize="xs" color="gray.500" mt={1}>Medication Logs</Text>
              </Box>
              
              <Box 
                p={4} 
                borderRadius="lg" 
                bg="green.50" 
                boxShadow="md"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.3s"
                textAlign="center"
              >
                <Text fontSize="sm" fontWeight="medium" color="green.600" mb={1}>TAKEN</Text>
                <Text fontSize="3xl" fontWeight="bold" color="green.600">{summary.taken}</Text>
                <Badge colorScheme="green" borderRadius="full" px={2} mt={1}>On Time</Badge>
              </Box>
              
              <Box 
                p={4} 
                borderRadius="lg" 
                bg="red.50" 
                boxShadow="md"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.3s"
                textAlign="center"
              >
                <Text fontSize="sm" fontWeight="medium" color="red.600" mb={1}>MISSED</Text>
                <Text fontSize="3xl" fontWeight="bold" color="red.600">{summary.missed}</Text>
                <Badge colorScheme="red" borderRadius="full" px={2} mt={1}>Not Taken</Badge>
              </Box>
              
              <Box 
                p={4} 
                borderRadius="lg" 
                bg="yellow.50" 
                boxShadow="md"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.3s"
                textAlign="center"
              >
                <Text fontSize="sm" fontWeight="medium" color="yellow.600" mb={1}>SKIPPED</Text>
                <Text fontSize="3xl" fontWeight="bold" color="yellow.600">{summary.skipped}</Text>
                <Badge colorScheme="yellow" borderRadius="full" px={2} mt={1}>Intentional</Badge>
              </Box>
              
              <Box 
                p={4} 
                borderRadius="lg" 
                bg="blue.50" 
                boxShadow="md"
                _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                transition="all 0.3s"
                textAlign="center"
                position="relative"
                overflow="hidden"
              >
                <Text fontSize="sm" fontWeight="medium" color="blue.600" mb={1}>ADHERENCE</Text>
                <Text 
                  fontSize="3xl" 
                  fontWeight="bold" 
                  color={summary.adherence >= 90 ? 'green.500' : summary.adherence >= 70 ? 'yellow.500' : 'red.500'}
                >
                  {summary.adherence}%
                </Text>
                <Box 
                  position="absolute" 
                  bottom="0" 
                  left="0" 
                  height="3px" 
                  width={`${summary.adherence}%`} 
                  bg={summary.adherence >= 90 ? 'green.500' : summary.adherence >= 70 ? 'yellow.500' : 'red.500'}
                />
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
        {loading ? (
          <Spinner size="xl" />
        ) : error ? (
          <Alert status="error" mb={4}><AlertIcon />{error}</Alert>
        ) : logs.length === 0 ? (
          <Text>No logs found for the selected filters.</Text>
        ) : (
          <Box 
            overflowX="auto"
            borderRadius="lg"
            boxShadow="xl"
            bg="white"
            p={4}
          >
            <Heading 
              as="h3" 
              size="md" 
              mb={4} 
              display="flex"
              alignItems="center"
              color="gray.700"
            >
              <FaClipboardList mr={2} /> Medication Logs
            </Heading>
            
            <Table variant="simple" colorScheme="gray" size="md">
              <Thead bg="gray.50">
                <Tr>
                  <Th py={4} borderBottomWidth="2px" borderColor="gray.200">Date</Th>
                  <Th py={4} borderBottomWidth="2px" borderColor="gray.200">Medication</Th>
                  <Th py={4} borderBottomWidth="2px" borderColor="gray.200">Status</Th>
                  <Th py={4} borderBottomWidth="2px" borderColor="gray.200">Scheduled Time</Th>
                  <Th py={4} borderBottomWidth="2px" borderColor="gray.200">Taken Time</Th>
                  <Th py={4} borderBottomWidth="2px" borderColor="gray.200">Notes</Th>
                </Tr>
              </Thead>
              <Tbody>
                {logs.map((log, index) => (
                  <Tr 
                    key={log._id}
                    _hover={{ bg: 'gray.50' }}
                    transition="background-color 0.2s"
                    bg={index % 2 === 0 ? 'white' : 'gray.50'}
                  >
                    <Td py={3}>{log.scheduledTime ? new Date(log.scheduledTime).toLocaleDateString() : '-'}</Td>
                    <Td py={3} fontWeight="medium">
                      {log.medicationId?.name || ''} 
                      {log.medicationId?.dosage ? (
                        <Badge ml={2} colorScheme="purple" variant="subtle">
                          {log.medicationId.dosage}
                        </Badge>
                      ) : ''}
                    </Td>
                    <Td py={3}>
                      <Badge 
                        colorScheme={statusColors[log.status] || 'gray'}
                        px={2}
                        py={1}
                        borderRadius="full"
                        textTransform="capitalize"
                        fontWeight="medium"
                      >
                        {log.status}
                      </Badge>
                    </Td>
                    <Td py={3} color="gray.600">
                      {log.scheduledTime ? (
                        <Flex align="center">
                          <FaClock size="12px" style={{ marginRight: '6px' }} />
                          {new Date(log.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Flex>
                      ) : '-'}
                    </Td>
                    <Td py={3} color="gray.600">
                      {log.takenTime ? (
                        <Flex align="center">
                          <FaCheckCircle size="12px" color="green" style={{ marginRight: '6px' }} />
                          {new Date(log.takenTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </Flex>
                      ) : '-'}
                    </Td>
                    <Td py={3}>
                      {log.notes ? (
                        <Tooltip label={log.notes} placement="top">
                          <Text noOfLines={1}>{log.notes}</Text>
                        </Tooltip>
                      ) : '-'}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            
            {logs.length > 0 && (
              <Flex justify="flex-end" mt={4}>
                <HStack spacing={3}>
                  <Button 
                    leftIcon={<FaFileCsv />} 
                    colorScheme="blue" 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportLogsToCSV(logs)} 
                    disabled={!logs.length}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
                    transition="all 0.2s"
                  >
                    Export as CSV
                  </Button>
                  <Button 
                    leftIcon={<FaFilePdf />} 
                    colorScheme="red" 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportLogsToPDF(logs)} 
                    disabled={!logs.length}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
                    transition="all 0.2s"
                  >
                    Export as PDF
                  </Button>
                </HStack>
              </Flex>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Reports;