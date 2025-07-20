import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, Box, Heading, VStack, Text, Flex, Spinner, Alert, AlertIcon, AlertDescription
} from '@chakra-ui/react';

const MedicationHistoryModal = ({ isOpen, onClose, med, logs, logsLoading, logsError, textColor }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Medication History{med ? `: ${med.name}` : ''}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {logsLoading && (
          <Flex justify="center" py={4}>
            <Spinner size="sm" color="brand.500" />
          </Flex>
        )}
        {logsError && (
          <Alert status="error" size="sm" borderRadius="md">
            <AlertIcon />
            <AlertDescription>{logsError}</AlertDescription>
          </Alert>
        )}
        {logs && logs.length === 0 && !logsLoading && !logsError && (
          <Text fontSize="sm" color={textColor} textAlign="center" py={2}>
            No history available yet
          </Text>
        )}
        {logs && logs.length > 0 && (
          <VStack align="stretch" spacing={1}>
            {logs.map((log, idx) => (
              <Box key={idx} p={2} borderRadius="md" bg={log.status === 'taken' ? 'green.50' : log.status === 'missed' ? 'red.50' : 'yellow.50'}>
                <Text fontSize="sm">
                  <b>Status:</b> {log.status} | <b>Time:</b> {new Date(log.takenTime || log.scheduledTime).toLocaleString()}
                </Text>
                {log.notes && <Text fontSize="xs" color="gray.500">Notes: {log.notes}</Text>}
              </Box>
            ))}
          </VStack>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} colorScheme="blue">Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default MedicationHistoryModal; 