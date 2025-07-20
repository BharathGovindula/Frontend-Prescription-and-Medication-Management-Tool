import React from 'react';
import {
  Box, Heading, Stack, InputGroup, InputLeftElement, Input, Select, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Flex, Badge, VStack, HStack, Text, Tooltip, IconButton, Button, Divider, Collapse, Spinner, Alert, AlertIcon, AlertDescription
} from '@chakra-ui/react';
import { SearchIcon, CheckIcon, CloseIcon, TimeIcon, EditIcon, InfoIcon, DeleteIcon, RepeatIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import MedicationHistoryModal from '../modals/MedicationHistoryModal';

const MedicationList = ({
  sortedMeds, borderColor, cardBgColor, headingColor, textColor,logs, logsLoading, logsError, userRole, renewalStatus,
  handleAction, openEditModal, openAdjustDosageModal, setDeletingMed, openRenewalModal, toggleLog,
  searchTerm, setSearchTerm, sortOption, setSortOption
}) => {
  const [historyModalOpen, setHistoryModalOpen] = React.useState(false);
  const [selectedMed, setSelectedMed] = React.useState(null);

  const openHistoryModal = (med) => {
    setSelectedMed(med);
    if (!logs[med._id]) {
      // fetchLogs is not available here, so call toggleLog to trigger log fetch in Dashboard
      if (typeof toggleLog === 'function') toggleLog(med._id);
    }
    setHistoryModalOpen(true);
  };
  const closeHistoryModal = () => {
    setHistoryModalOpen(false);
    setSelectedMed(null);
  };

  return (
    <Box mb={6} bg={cardBgColor} p={4} borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={4} color={headingColor}>Medication Management</Heading>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={4}>
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
      {sortedMeds.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sortedMeds.map((med) => (
            <Card
              key={med._id}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              bg={cardBgColor}
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
            >
              <CardHeader pb={0}>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color={headingColor} fontWeight="bold">{med.name}</Heading>
                  <Badge colorScheme="blue" fontSize="0.8em" borderRadius="full" px={2}>Active</Badge>
                </Flex>
              </CardHeader>
              <CardBody pt={2}>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Text fontWeight="medium" color={textColor}>Dosage:</Text>
                    <Text>{med.dosage}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium" color={textColor}>Frequency:</Text>
                    <Text>{med.frequency}</Text>
                  </HStack>
                  <Divider my={2} />
                  <HStack spacing={2} justify="center">
                    <Button
                      colorScheme="green"
                      variant="solid"
                      size="sm"
                      borderRadius="md"
                      onClick={() => handleAction(med._id, 'taken')}
                    >
                      Take ✔️
                    </Button>
                    <Button
                      colorScheme="yellow"
                      variant="solid"
                      size="sm"
                      borderRadius="md"
                      onClick={() => handleAction(med._id, 'skipped')}
                    >
                      Skip ⏩
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="solid"
                      size="sm"
                      borderRadius="md"
                      onClick={() => handleAction(med._id, 'missed')}
                    >
                      Miss ❌
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
              <CardFooter pt={0}>
                <VStack width="full" spacing={3}>
                  <HStack width="full" spacing={2}>
                    <Button
                      leftIcon={<EditIcon />}
                      onClick={() => openEditModal(med)}
                      size="sm"
                      flex={1}
                      colorScheme="blue"
                      variant="outline"
                      borderRadius="md"
                    >
                      Edit
                    </Button>
                    <Button
                      leftIcon={<InfoIcon />}
                      onClick={() => openAdjustDosageModal(med)}
                      size="sm"
                      flex={1}
                      colorScheme="cyan"
                      variant="outline"
                      borderRadius="md"
                    >
                      Dosage
                    </Button>
                    <Button
                      leftIcon={<DeleteIcon />}
                      onClick={() => setDeletingMed(med)}
                      size="sm"
                      flex={1}
                      colorScheme="red"
                      variant="outline"
                      borderRadius="md"
                    >
                      Delete
                    </Button>
                  </HStack>
                  {userRole === 'user' && (
                    <Button
                      leftIcon={<RepeatIcon />}
                      onClick={() => openRenewalModal(med)}
                      size="sm"
                      flex={1}
                      colorScheme="purple"
                      variant="outline"
                      borderRadius="md"
                    >
                      Request Renewal
                    </Button>
                  )}
                  {renewalStatus[med._id] && (
                    <Badge colorScheme={renewalStatus[med._id].status === 'pending' ? 'yellow' : renewalStatus[med._id].status === 'approved' ? 'green' : 'red'}>
                      Renewal: {renewalStatus[med._id].status}
                    </Badge>
                  )}
                  <Button
                    rightIcon={selectedMed && selectedMed._id === med._id && historyModalOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    onClick={() => openHistoryModal(med)}
                    size="sm"
                    width="full"
                    variant="ghost"
                    colorScheme="blue"
                  >
                    {selectedMed && selectedMed._id === med._id && historyModalOpen ? 'Hide History' : 'Show History'}
                  </Button>
                </VStack>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Text color="gray.500" textAlign="center">No medications found.</Text>
      )}
      <MedicationHistoryModal
        isOpen={historyModalOpen}
        onClose={closeHistoryModal}
        med={selectedMed}
        logs={selectedMed ? logs[selectedMed._id] : []}
        logsLoading={selectedMed ? logsLoading[selectedMed._id] : false}
        logsError={selectedMed ? logsError[selectedMed._id] : null}
        textColor={textColor}
      />
    </Box>
  );
};

export default MedicationList; 