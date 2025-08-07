import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Badge,
  VStack,
  HStack,
  Collapse,
  IconButton,
  Input,
  Select,
  Container,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Tooltip,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { getToken } from '../utils/token';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon, CalendarIcon, WarningIcon, CheckIcon, CloseIcon, TimeIcon, EditIcon, DeleteIcon, InfoIcon, RepeatIcon } from '@chakra-ui/icons';
import { setLogs as setOfflineLogs, getLogs, clearLogs } from '../utils/db';
import { Bar } from 'react-chartjs-2'; // (optional, for future analytics)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);
import { FaMedal, FaFire, FaShareAlt, FaClock, FaCalendarAlt, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';
import Confetti from 'react-confetti';
import StatsCards from '../components/dashboard/StatsCards';
import AdherenceStreaks from '../components/dashboard/AdherenceStreaks';
import TrendsChart from '../components/dashboard/TrendsChart';
import PersonalizedSuggestions from '../components/dashboard/PersonalizedSuggestions';
import WarningsAlerts from '../components/dashboard/WarningsAlerts';
import MedicationList from '../components/dashboard/MedicationList';
import EditMedicationModal from '../components/modals/EditMedicationModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import AdjustDosageModal from '../components/modals/AdjustDosageModal';
import RenewalRequestModal from '../components/modals/RenewalRequestModal';
import InteractionWarningsModal from '../components/modals/InteractionWarningsModal';
import { useMedications } from '../hooks/useMedications';
import { useAdherenceStats } from '../hooks/useAdherenceStats';
import { useStreaks } from '../hooks/useStreaks';
import { useTrends } from '../hooks/useTrends';
import { useSuggestions } from '../hooks/useSuggestions';
import { useOfflineSync } from '../hooks/useOfflineSync';

const statusColors = {
  taken: 'green',
  missed: 'red',
  skipped: 'yellow',
  scheduled: 'blue',
};

const Dashboard = () => {
  const { medications, loading, error, fetchMedications } = useMedications();
  const [editingMed, setEditingMed] = useState(null);
  const [editFields, setEditFields] = useState({ name: '', dosage: '', frequency: '' });
  const [deletingMed, setDeletingMed] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [logOpen, setLogOpen] = useState({});
  const [logs, setLogs] = useState({});
  const [logsLoading, setLogsLoading] = useState({});
  const [logsError, setLogsError] = useState({});
  const [adjustingDosageMed, setAdjustingDosageMed] = useState(null);
  const [newDosage, setNewDosage] = useState('');
  const [dosageLoading, setDosageLoading] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');
  const [interactionWarnings, setInteractionWarnings] = useState([]);
  const [renewalModalOpen, setRenewalModalOpen] = useState(false);
  const [renewalMessage, setRenewalMessage] = useState('');
  const [renewalMed, setRenewalMed] = useState(null);
  const [renewalStatus, setRenewalStatus] = useState({});
  const [renewalLoading, setRenewalLoading] = useState(false);
  const [renewalHistoryOpen, setRenewalHistoryOpen] = useState({});
  const [renewalResponse, setRenewalResponse] = useState('');
  const [renewalActionLoading, setRenewalActionLoading] = useState(false);
  const userRole = useSelector((state) => state.auth.user?.role || 'user'); // adjust as needed
  const [allRenewals, setAllRenewals] = useState([]);
  const { adherenceStats, adherenceLoading, adherenceError, fetchAdherenceStats } = useAdherenceStats();
  const { trends, trendsLoading, trendsError, fetchTrends, setTrends } = useTrends();
  const { suggestions, suggestionsLoading, suggestionsError, fetchSuggestions, setSuggestions } = useSuggestions();
  const { streaks, streaksLoading, streaksError, fetchStreaks, setStreaks } = useStreaks();
  const [trendView, setTrendView] = useState('daily');
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastBadgeCount, setLastBadgeCount] = useState(0);
  const toast = useToast();
  const [interactionModalOpen, setInteractionModalOpen] = useState(false);
  const { syncLogs, actionMessage, setActionMessage } = useOfflineSync();

  useEffect(() => {
    fetchMedications();
    fetchAdherenceStats();
    fetchTrends();
    fetchSuggestions();
    fetchStreaks();
  }, []);

  useEffect(() => {
    fetchConflicts();
  }, [medications]);

  useEffect(() => {
    fetchInteractionWarnings();
  }, []);

  useEffect(() => {
    fetchInteractionWarnings();
  }, [medications]);

  useEffect(() => {
    const fetchRenewalStatuses = async () => {
      try {
        const statuses = {};
        for (const med of medications) {
          const res = await api.get(`/api/medications/${med._id}/renewals`);
          if (res.data && res.data.length > 0) {
            // Show the latest request
            const latest = res.data[res.data.length - 1];
            statuses[med._id] = latest;
            statuses[med._id + '_history'] = res.data;
          }
        }
        setRenewalStatus(statuses);
      } catch (err) {
        // handle error
      }
    };
    if (medications.length > 0) fetchRenewalStatuses();
  }, [medications]);

  const fetchAllRenewals = async () => {
    try {
      const res = await api.get('/api/medications/renewals');
      setAllRenewals(res.data);
    } catch (err) {
      // handle error
    }
  };

  useEffect(() => {
    if (userRole !== 'user') {
      fetchAllRenewals();
    }
  }, [userRole]);

  const fetchConflicts = async () => {
    try {
      const res = await api.get('/api/medications/conflicts');
      setConflicts(res.data || []);
    } catch(err) {
      console.error(err);
    }
  };

  const fetchInteractionWarnings = async () => {
    try {
      const res = await api.get('/api/medications/interactions');
      setInteractionWarnings(res.data || []);
    }  catch(err) {
      console.error(err);
    }
  };

  const handleAction = async (medId, status) => {
    setActionMessage('');
    const logData = {
      medicationId: medId,
      status,
      scheduledTime: new Date(),
      takenTime: status === 'taken' ? new Date() : null,
      notes: '',
    };
    if (!navigator.onLine) {
      // Offline: store log in IndexedDB
      const offlineLogs = (await getLogs()) || [];
      await setOfflineLogs([...offlineLogs, logData]);
      setActionMessage(`Action '${status}' saved offline! Will sync when online.`);
      toast({
        title: `Action '${status}' saved offline`,
        description: 'Will sync when online.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await api.post(`/api/medications/${medId}/log`, logData);
      setActionMessage(`Action '${status}' logged!`);
      toast({
        title: `Action '${status}' logged!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      setActionMessage('Failed to log action');
      toast({
        title: 'Failed to log action',
        description: err.response?.data?.message || err.message || 'Failed to log action',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('online', syncLogs);
    syncLogs();
    return () => window.removeEventListener('online', syncLogs);
  }, [syncLogs]);

  const openEditModal = (med) => {
    setEditingMed(med);
    setEditFields({ name: med.name, dosage: med.dosage, frequency: med.frequency });
    onOpen();
  };

  const handleEditChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    // Only send allowed fields
    const payload = {
      name: editFields.name,
      dosage: editFields.dosage,
      frequency: editFields.frequency,
      schedule: editingMed.schedule,
      // isActive: editingMed.isActive, // Optionally include if needed
    };
    console.log('Submitting medication update payload:', payload);
    try {
      await api.put(`/api/medications/${editingMed._id}`, payload);
      setActionMessage('Medication updated!');
      toast({
        title: 'Medication updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchMedications();
      onClose();
    } catch (err) {
      console.error('Medication update error:', err.response?.data || err);
      setActionMessage('Failed to update medication');
      toast({
        title: 'Failed to update medication',
        description: err.response?.data?.message || err.message || 'Failed to update medication',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMed) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/medications/${deletingMed._id}`);
      setActionMessage('Medication deleted!');
      toast({
        title: 'Medication deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchMedications();
      setDeletingMed(null);
      onClose();
    } catch (err) {
      console.error(err);
      setActionMessage('Failed to delete medication');
      toast({
        title: 'Failed to delete medication',
        description: err.response?.data?.message || err.message || 'Failed to delete medication',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openAdjustDosageModal = (med) => {
    setAdjustingDosageMed(med);
    setNewDosage(med.dosage || '');
    onOpen();
  };
  const handleAdjustDosage = async () => {
    setDosageLoading(true);
    const payload = {
      name: adjustingDosageMed.name,
      dosage: newDosage,
      frequency: adjustingDosageMed.frequency,
      schedule: adjustingDosageMed.schedule,
      // isActive: adjustingDosageMed.isActive, // optionally include if needed
    };
    try {
      await api.put(`/api/medications/${adjustingDosageMed._id}`, payload);
      setActionMessage('Dosage updated!');
      fetchMedications();
      setAdjustingDosageMed(null);
      onClose();
    } catch (err) {
      console.error(err);
      setActionMessage('Failed to update dosage');
      toast({
        title: 'Failed to update dosage',
        description: err.response?.data?.message || err.message || 'Failed to update dosage',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDosageLoading(false);
    }
  };

  const toggleLog = (medId) => {
    setLogOpen((prev) => ({ ...prev, [medId]: !prev[medId] }));
    if (!logs[medId]) fetchLogs(medId);
  };

  const fetchLogs = async (medId) => {
    setLogsLoading((prev) => ({ ...prev, [medId]: true }));
    setLogsError((prev) => ({ ...prev, [medId]: '' }));
    try {
      const res = await api.get(`/api/medications/${medId}/logs`);
      setLogs((prev) => ({ ...prev, [medId]: res.data }));
    } catch (err) {
      console.error(err);
      setLogsError((prev) => ({ ...prev, [medId]: 'Failed to load logs' }));
    } finally {
      setLogsLoading((prev) => ({ ...prev, [medId]: false }));
    }
  };

  const openRenewalModal = (med) => {
    setRenewalMed(med);
    setRenewalMessage('');
    setRenewalModalOpen(true);
  };
  const closeRenewalModal = () => {
    setRenewalModalOpen(false);
    setRenewalMed(null);
    setRenewalMessage('');
  };
  const handleRenewalRequest = async () => {
    if (!renewalMed) return;
    setRenewalLoading(true);
    try {
      const res = await api.post(`/api/medications/${renewalMed._id}/renew`, { message: renewalMessage });
      setRenewalStatus((prev) => ({ ...prev, [renewalMed._id]: { status: 'pending', requestedAt: new Date().toISOString() } }));
      closeRenewalModal();
      toast({
        title: 'Renewal requested',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to request renewal',
        description: err.response?.data?.message || err.message || 'Failed to request renewal',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRenewalLoading(false);
    }
  };

  const toggleRenewalHistory = (medId) => {
    setRenewalHistoryOpen((prev) => ({ ...prev, [medId]: !prev[medId] }));
  };
  const handleRenewalAction = async (medId, requestId, status) => {
    setRenewalActionLoading(true);
    try {
      await api.put(`/api/medications/${medId}/renewals/${requestId}`, { status, response: renewalResponse });
      setRenewalResponse('');
      // Refresh renewal statuses
      const res = await api.get(`/api/medications/${medId}/renewals`);
      setRenewalStatus((prev) => ({ ...prev, [medId]: res.data[res.data.length - 1] }));
      if (userRole !== 'user') {
        // Refresh all renewals for doctor/admin
        await fetchAllRenewals();
      }
      toast({
        title: `Renewal ${status === 'approved' ? 'approved' : 'denied'}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to update renewal',
        description: err.response?.data?.message || err.message || 'Failed to update renewal',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRenewalActionLoading(false);
    }
  };

  const filteredMeds = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? med.isActive : !med.isActive);
    return matchesSearch && matchesStatus;
  });

  const getNextScheduledTime = (med) => {
    const sched = med.schedule || {};
    if (sched.type === 'fixed' && sched.times && sched.times.length > 0) {
      // Find the next time today or tomorrow
      const now = new Date();
      const today = now.toLocaleString('en-US', { weekday: 'long' });
      const days = sched.days && sched.days.length > 0 ? sched.days : [today];
      let soonest = null;
      for (const day of days) {
        for (const t of sched.times) {
          const [h, m] = t.split(':').map(Number);
          let date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
          if (day !== today) {
            // Find next occurrence of this day
            const dayIdx = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(day);
            let diff = (dayIdx - now.getDay() + 7) % 7;
            if (diff === 0 && date < now) diff = 7;
            date.setDate(date.getDate() + diff);
          } else if (date < now) {
            date.setDate(date.getDate() + 7);
          }
          if (!soonest || date < soonest) soonest = date;
        }
      }
      return soonest;
    }
    // For interval/custom, fallback to createdAt
    return med.createdAt ? new Date(med.createdAt) : new Date();
  };
  const sortedMeds = [...filteredMeds].sort((a, b) => {
    if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
    if (sortOption === 'next-time') {
      const tA = getNextScheduledTime(a);
      const tB = getNextScheduledTime(b);
      return tA - tB;
    }
    return 0;
  });

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const statBgColor = useColorModeValue('blue.50', 'blue.900');
  
  // Count active medications
  const activeMedsCount = medications.filter(med => med.isActive).length;
  
  // Get today's scheduled medications
  const today = new Date().toLocaleString('en-US', { weekday: 'long' });
  const todaysMeds = medications.filter(med => {
    const sched = med.schedule || {};
    return sched.days && sched.days.includes(today) && med.isActive;
  });

  // Confetti animation when a new badge is earned
  useEffect(() => {
    if (streaks.badges && streaks.badges.length > lastBadgeCount) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setLastBadgeCount(streaks.badges.length);
      toast({ title: 'Congratulations!', description: `You earned a new badge: ${streaks.badges[streaks.badges.length - 1]}`, status: 'success', duration: 4000, isClosable: true });
    }
  }, [streaks.badges]);

  // Badge requirements
  const badgeRequirements = [
    { label: '3-day Streak', days: 3 },
    { label: '7-day Streak', days: 7 },
    { label: '30-day Streak', days: 30 },
  ];
  const nextBadge = badgeRequirements.find(b => !streaks.badges.includes(b.label));
  const progressToNext = nextBadge ? Math.min(100, Math.round((streaks.currentStreak / nextBadge.days) * 100)) : 100;

  // Share handler
  const handleShare = () => {
    const text = `My current medication adherence streak: ${streaks.currentStreak} days! Badges: ${streaks.badges.join(', ')}`;
    if (navigator.share) {
      navigator.share({ title: 'My Medication Streak', text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copied!', description: 'Streak copied to clipboard.', status: 'info', duration: 2000, isClosable: true });
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

  const openInteractionModal = async () => {
    setInteractionModalOpen(true);
    setInteractionWarnings(interactionWarnings); // Ensure the correct state is passed
  };
  const closeInteractionModal = () => setInteractionModalOpen(false);
  
  // Example for log sync (if applicable)
  const handleSyncLogs = async () => {
    try {
      await syncLogs();
      toast({
        title: 'Logs synced',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to sync logs',
        description: err.message || 'Failed to sync logs',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box 
        borderRadius="xl" 
        overflow="hidden" 
        boxShadow="2xl"
        bg={bgColor}
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
        <Flex direction="column" w="full">
          {/* Replace Heading and Button with a Flex row */}
          <Flex align="center" justify="space-between" mb={6}>
            <Heading 
              as="h1" 
              size="xl" 
              color={headingColor}
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
              Medication Dashboard
            </Heading>
            <Button leftIcon={<FaExclamationTriangle />} colorScheme="red" variant="solid" maxW="320px" onClick={openInteractionModal}>
              Medication Interaction Warnings
            </Button>
          </Flex>
          
          {loading ? (
            <Flex justify="center" align="center" h="300px">
              <Spinner size="xl" thickness="4px" color="brand.500" />
            </Flex>
          ) : (
            <>
              {/* Alerts Section */}
              {error && (
                <Alert status="error" mb={4} borderRadius="md">
                  <AlertIcon />
                  <AlertTitle mr={2}>Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {actionMessage && (
                <Alert status="info" mb={4} borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{actionMessage}</AlertDescription>
                </Alert>
              )}
              
              {/* Stats Cards */}
              <StatsCards
                medications={medications}
                activeMedsCount={activeMedsCount}
                todaysMeds={todaysMeds}
                today={today}
                adherenceStats={adherenceStats}
                adherenceLoading={adherenceLoading}
                adherenceError={adherenceError}
              />
              
              {/* Warnings Section */}
              <WarningsAlerts
                conflicts={conflicts}
                interactionWarnings={interactionWarnings}
                headingColor={headingColor}
              />
              
              {/* Adherence Streaks & Badges Section */}
              <AdherenceStreaks
                showConfetti={showConfetti}
                streaksLoading={streaksLoading}
                streaksError={streaksError}
                streaks={streaks}
                nextBadge={nextBadge}
                progressToNext={progressToNext}
                handleShare={handleShare}
              />

              {/* Personalized Suggestions Section */}
              <PersonalizedSuggestions
                suggestionsLoading={suggestionsLoading}
                suggestionsError={suggestionsError}
                suggestions={suggestions}
                addToGoogleCalendar={addToGoogleCalendar}
              />

              {/* Search and Filter Controls */}
              <Box mb={6} bg={cardBgColor} p={4} borderRadius="lg" boxShadow="sm">
                <Heading size="md" mb={4} color={headingColor}>Medication Management</Heading>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search medications..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      borderRadius="md"
                      focusBorderColor="brand.500"
                    />
                  </InputGroup>
                  
                  <Select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)} 
                    borderRadius="md"
                    focusBorderColor="brand.500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </Select>
                  
                  <Select 
                    value={sortOption} 
                    onChange={e => setSortOption(e.target.value)}
                    borderRadius="md"
                    focusBorderColor="brand.500"
                  >
                    <option value="name-asc">Sort: Name (A-Z)</option>
                    <option value="name-desc">Sort: Name (Z-A)</option>
                    <option value="next-time">Sort: Next Scheduled</option>
                  </Select>
                </Stack>
              </Box>
              
              {/* Medications Grid */}
              <MedicationList
                sortedMeds={sortedMeds}
                borderColor={borderColor}
                cardBgColor={cardBgColor}
                headingColor={headingColor}
                textColor={textColor}
                logOpen={logOpen}
                logs={logs}
                logsLoading={logsLoading}
                logsError={logsError}
                userRole={userRole}
                renewalStatus={renewalStatus}
                handleAction={handleAction}
                openEditModal={openEditModal}
                openAdjustDosageModal={openAdjustDosageModal}
                setDeletingMed={setDeletingMed}
                openRenewalModal={openRenewalModal}
                toggleLog={toggleLog}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortOption={sortOption}
                setSortOption={setSortOption}
              />

              {/* Trends Chart Section - moved to bottom */}
              <TrendsChart
                trendView={trendView}
                setTrendView={setTrendView}
                trendsLoading={trendsLoading}
                trendsError={trendsError}
                trends={trends}
              />
            </>
          )}
        </Flex>
      </Box>

      {userRole !== 'user' && (
        <Box mb={8} p={4} borderWidth="1px" borderRadius="lg" bg={cardBgColor} boxShadow="md">
          <Heading size="md" mb={4}>All Renewal Requests</Heading>
          {allRenewals.length === 0 ? (
            <Text>No renewal requests found.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {allRenewals.map((req) => (
                <Box key={req._id} p={3} borderWidth="1px" borderRadius="md" bg={cardBgColor}>
                  <Text fontWeight="bold">User: {req.medication.user?.profile?.firstName || ''} {req.medication.user?.profile?.lastName || ''} ({req.medication.user?.email})</Text>
                  <Text>Medication: {req.medication.name} ({req.medication.dosage})</Text>
                  <Text>Status: <Badge colorScheme={req.status === 'pending' ? 'yellow' : req.status === 'approved' ? 'green' : 'red'}>{req.status}</Badge></Text>
                  <Text>Requested: {new Date(req.requestedAt).toLocaleString()}</Text>
                  {req.message && <Text>Message: {req.message}</Text>}
                  {req.status === 'pending' && (
                    <Box mt={2}>
                      <Textarea
                        placeholder="Response message"
                        value={renewalResponse}
                        onChange={e => setRenewalResponse(e.target.value)}
                        mb={2}
                      />
                      <Button colorScheme="green" size="sm" mr={2} isLoading={renewalActionLoading} onClick={() => handleRenewalAction(req.medication._id, req._id, 'approved')}>Approve</Button>
                      <Button colorScheme="red" size="sm" isLoading={renewalActionLoading} onClick={() => handleRenewalAction(req.medication._id, req._id, 'denied')}>Deny</Button>
                    </Box>
                  )}
                  {req.status !== 'pending' && req.response && <Text>Response: {req.response}</Text>}
                </Box>
              ))}
            </SimpleGrid>
          )}
    </Box>
      )}

      {/* Removed Trends Chart, Personalized Suggestions, and Adherence Streaks & Badges sections - moved to new positions */}

      {/* Edit Medication Modal */}
      <EditMedicationModal
        isOpen={isOpen && !!editingMed}
        onClose={onClose}
        editingMed={editingMed}
        editFields={editFields}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        editLoading={editLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingMed}
        onClose={() => setDeletingMed(null)}
        deletingMed={deletingMed}
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />

      {/* Adjust Dosage Modal */}
      <AdjustDosageModal
        isOpen={isOpen && !!adjustingDosageMed}
        onClose={onClose}
        adjustingDosageMed={adjustingDosageMed}
        newDosage={newDosage}
        setNewDosage={setNewDosage}
        handleAdjustDosage={handleAdjustDosage}
        dosageLoading={dosageLoading}
      />

      {/* Renewal Modal */}
      <RenewalRequestModal
        isOpen={renewalModalOpen && !!renewalMed}
        onClose={closeRenewalModal}
        renewalMed={renewalMed}
        renewalMessage={renewalMessage}
        setRenewalMessage={setRenewalMessage}
        handleRenewalRequest={handleRenewalRequest}
        renewalLoading={renewalLoading}
      />

      {/* Medication Interaction Warnings Modal */}
      <InteractionWarningsModal
        isOpen={interactionModalOpen}
        onClose={closeInteractionModal}
        interactionWarnings={interactionWarnings}
      />
    </Container>
  );
};

export default Dashboard;