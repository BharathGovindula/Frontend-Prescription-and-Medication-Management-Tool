import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, Text, Spinner
} from '@chakra-ui/react';

const DeleteConfirmationModal = ({ isOpen, onClose, deletingMed, handleDelete, deleteLoading }) => (
  <Modal isOpen={isOpen && !!deletingMed} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Delete Medication</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>Are you sure you want to delete <b>{deletingMed?.name}</b>? This action cannot be undone.</Text>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={3} variant="ghost">Cancel</Button>
        <Button colorScheme="red" onClick={handleDelete} isLoading={deleteLoading}>
          Delete
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default DeleteConfirmationModal; 