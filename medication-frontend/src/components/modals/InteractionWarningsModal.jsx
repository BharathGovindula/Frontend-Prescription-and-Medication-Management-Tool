import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, VStack, Text, Alert, AlertIcon
} from '@chakra-ui/react';

const InteractionWarningsModal = ({ isOpen, onClose, interactionWarnings }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Medication Interaction Warnings</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {interactionWarnings && interactionWarnings.length > 0 ? (
          <VStack align="start" spacing={2}>
            {interactionWarnings.map((w, idx) => (
              <Alert status="error" key={idx} borderRadius="md">
                <AlertIcon />
                <Text><b>{w.med1.name}</b> may interact with <b>{w.med2.name}</b></Text>
              </Alert>
            ))}
          </VStack>
        ) : (
          <Text>No interaction warnings at this time.</Text>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} colorScheme="blue">Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default InteractionWarningsModal; 