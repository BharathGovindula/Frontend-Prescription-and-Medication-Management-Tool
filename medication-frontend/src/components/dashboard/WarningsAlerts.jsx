import React from 'react';
import { Box, Heading, Alert, AlertIcon, AlertTitle, AlertDescription, VStack, Text } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

const WarningsAlerts = ({ conflicts, interactionWarnings, headingColor }) => (
  (conflicts.length > 0 || interactionWarnings.length > 0) && (
    <Box mb={6}>
      <Heading size="md" mb={4} color={headingColor}>Warnings & Alerts</Heading>
      {conflicts.length > 0 && (
        <Alert status="warning" mb={4} borderRadius="lg">
          <AlertIcon as={WarningIcon} />
          <Box flex="1">
            <AlertTitle>Schedule Conflicts Detected</AlertTitle>
            <AlertDescription>
              <VStack align="start" spacing={2} mt={2}>
                {conflicts.map((c, idx) => (
                  <Text key={idx}>
                    <b>{c.med1.name}</b> & <b>{c.med2.name}</b> overlap on <b>{c.day}</b> at <b>{c.time}</b>
                  </Text>
                ))}
              </VStack>
            </AlertDescription>
          </Box>
        </Alert>
      )}
      {interactionWarnings.length > 0 && (
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Medication Interaction Warnings</AlertTitle>
            <AlertDescription>
              <VStack align="start" spacing={2} mt={2}>
                {interactionWarnings.map((w, idx) => (
                  <Text key={idx}>
                    <b>{w.med1.name}</b> may interact with <b>{w.med2.name}</b>
                  </Text>
                ))}
              </VStack>
            </AlertDescription>
          </Box>
        </Alert>
      )}
    </Box>
  )
);

export default WarningsAlerts; 