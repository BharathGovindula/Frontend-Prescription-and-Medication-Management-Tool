import React from 'react';
import { Box, Heading, Spinner, Alert, AlertIcon, VStack, Text, Button } from '@chakra-ui/react';
import { FaClock, FaCalendarAlt, FaLightbulb } from 'react-icons/fa';

const PersonalizedSuggestions = ({ suggestionsLoading, suggestionsError, suggestions, addToGoogleCalendar }) => (
  <Box mb={6}>
    <Heading as="h2" size="md" mb={2}>Personalized Suggestions</Heading>
    {suggestionsLoading ? (
      <Spinner size="md" />
    ) : suggestionsError ? (
      <Alert status="error"><AlertIcon />{suggestionsError}</Alert>
    ) : suggestions.length > 0 ? (
      <VStack align="start" spacing={1}>
        {suggestions.map((s, idx) => (
          <Box key={idx} p={2} borderWidth={1} borderRadius="md" bg={s.type === 'timing' ? 'yellow.50' : s.type === 'routine' ? 'blue.50' : 'gray.50'} display="flex" alignItems="center" gap={2}>
            {s.type === 'timing' && <FaClock color="#ECC94B" title="Timing Suggestion" />}
            {s.type === 'routine' && <FaCalendarAlt color="#3182CE" title="Routine Suggestion" />}
            {s.type === 'general' && <FaLightbulb color="#A0AEC0" title="General Suggestion" />}
            <Text fontSize="sm" flex={1}>{s.text}</Text>
            {(s.type === 'timing' || s.type === 'routine') && (
              <Button leftIcon={<FaCalendarAlt />} colorScheme="green" size="xs" variant="outline" onClick={() => addToGoogleCalendar(s)}>
                Add to Google Calendar
              </Button>
            )}
          </Box>
        ))}
      </VStack>
    ) : (
      <Text color="green.600">No suggestions at this time. Keep up the good work!</Text>
    )}
  </Box>
);

export default PersonalizedSuggestions; 