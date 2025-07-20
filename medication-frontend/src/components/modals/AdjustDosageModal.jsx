import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Spinner
} from '@chakra-ui/react';

const AdjustDosageModal = ({ isOpen, onClose, adjustingDosageMed, newDosage, setNewDosage, handleAdjustDosage, dosageLoading }) => (
  <Modal isOpen={isOpen && !!adjustingDosageMed} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Adjust Dosage</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl mb={3}>
          <FormLabel>New Dosage for <b>{adjustingDosageMed?.name}</b></FormLabel>
          <Input value={newDosage} onChange={e => setNewDosage(e.target.value)} />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={3} variant="ghost">Cancel</Button>
        <Button colorScheme="cyan" onClick={handleAdjustDosage} isLoading={dosageLoading}>
          Save
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default AdjustDosageModal; 