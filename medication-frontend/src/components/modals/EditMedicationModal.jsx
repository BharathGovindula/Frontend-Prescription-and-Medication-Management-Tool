import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, useDisclosure, Spinner
} from '@chakra-ui/react';

const EditMedicationModal = ({ isOpen, onClose, editingMed, editFields, handleEditChange, handleEditSubmit, editLoading }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Edit Medication</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl mb={3}>
          <FormLabel>Name</FormLabel>
          <Input name="name" value={editFields.name} onChange={handleEditChange} />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Dosage</FormLabel>
          <Input name="dosage" value={editFields.dosage} onChange={handleEditChange} />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Frequency</FormLabel>
          <Input name="frequency" value={editFields.frequency} onChange={handleEditChange} />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={3} variant="ghost">Cancel</Button>
        <Button colorScheme="blue" onClick={handleEditSubmit} isLoading={editLoading}>
          Save
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default EditMedicationModal; 