import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Spinner
} from '@chakra-ui/react';

const RenewalRequestModal = ({ isOpen, onClose, renewalMed, renewalMessage, setRenewalMessage, handleRenewalRequest, renewalLoading }) => (
  <Modal isOpen={isOpen && !!renewalMed} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Request Renewal</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl mb={3}>
          <FormLabel>Renewal Message for <b>{renewalMed?.name}</b></FormLabel>
          <Input value={renewalMessage} onChange={e => setRenewalMessage(e.target.value)} placeholder="Enter message for doctor (optional)" />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={3} variant="ghost">Cancel</Button>
        <Button colorScheme="purple" onClick={handleRenewalRequest} isLoading={renewalLoading}>
          Request
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default RenewalRequestModal; 