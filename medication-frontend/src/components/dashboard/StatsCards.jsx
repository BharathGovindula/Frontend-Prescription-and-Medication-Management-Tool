import React from 'react';
import {
  SimpleGrid, Card, CardBody, Flex, Box, Stat, StatLabel, StatNumber, StatHelpText, Spinner, Badge, HStack, Text
} from '@chakra-ui/react';
import { CalendarIcon, CheckIcon, TimeIcon } from '@chakra-ui/icons';
import { FaMedal } from 'react-icons/fa';

const StatsCards = ({ medications, activeMedsCount, todaysMeds, today, adherenceStats, adherenceLoading, adherenceError }) => (
  <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
    {/* Total Medications */}
    <Card bg="white" borderRadius="lg" boxShadow="lg" _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }} transition="all 0.3s ease" position="relative" overflow="hidden" _before={{ content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'brand.500' }}>
      <CardBody>
        <Flex align="center" mb={2}>
          <Box bg="brand.50" p={2} borderRadius="full" mr={3}>
            <CalendarIcon boxSize={5} color="brand.500" />
          </Box>
          <Stat>
            <StatLabel fontSize="md" fontWeight="medium" color="gray.600">Total Medications</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, brand.500, brand.600)" bgClip="text">
              {medications.length}
            </StatNumber>
            <StatHelpText fontSize="sm" color="gray.500">Your medication inventory</StatHelpText>
          </Stat>
        </Flex>
      </CardBody>
    </Card>
    {/* Active Medications */}
    <Card bg="white" borderRadius="lg" boxShadow="lg" _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }} transition="all 0.3s ease" position="relative" overflow="hidden" _before={{ content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'green.500' }}>
      <CardBody>
        <Flex align="center" mb={2}>
          <Box bg="green.50" p={2} borderRadius="full" mr={3}>
            <CheckIcon boxSize={5} color="green.500" />
          </Box>
          <Stat>
            <StatLabel fontSize="md" fontWeight="medium" color="gray.600">Active Medications</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, green.400, green.600)" bgClip="text">
              {activeMedsCount}
            </StatNumber>
            <StatHelpText fontSize="sm" color="gray.500">Currently active</StatHelpText>
          </Stat>
        </Flex>
      </CardBody>
    </Card>
    {/* Today's Schedule */}
    <Card bg="white" borderRadius="lg" boxShadow="lg" _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }} transition="all 0.3s ease" position="relative" overflow="hidden" _before={{ content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'blue.500' }}>
      <CardBody>
        <Flex align="center" mb={2}>
          <Box bg="blue.50" p={2} borderRadius="full" mr={3}>
            <TimeIcon boxSize={5} color="blue.500" />
          </Box>
          <Stat>
            <StatLabel fontSize="md" fontWeight="medium" color="gray.600">Today's Schedule</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, blue.600)" bgClip="text">
              {todaysMeds.length}
            </StatNumber>
            <StatHelpText fontSize="sm" color="gray.500">Medications for {today}</StatHelpText>
          </Stat>
        </Flex>
      </CardBody>
    </Card>
    {/* Adherence Stat Card */}
    <Card bg="white" borderRadius="lg" boxShadow="lg" _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }} transition="all 0.3s ease" position="relative" overflow="hidden" _before={{ content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'purple.500' }}>
      <CardBody>
        <Flex align="center" mb={2}>
          <Box bg="purple.50" p={2} borderRadius="full" mr={3}>
            <FaMedal size="20px" color="#805AD5" />
          </Box>
          <Stat>
            <StatLabel fontSize="md" fontWeight="medium" color="gray.600">Adherence</StatLabel>
            {adherenceLoading ? (
              <Spinner size="md" />
            ) : adherenceError ? (
              <Text color="red.500">{adherenceError}</Text>
            ) : adherenceStats ? (
              <>
                <StatNumber fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, purple.400, purple.600)" bgClip="text">
                  {adherenceStats.adherencePercent}%
                </StatNumber>
                <StatHelpText>
                  <HStack spacing={2} mt={1} flexWrap="wrap">
                    <Badge colorScheme="green" borderRadius="full" px={2} py={1}>Taken: {adherenceStats.taken}</Badge>
                    <Badge colorScheme="red" borderRadius="full" px={2} py={1}>Missed: {adherenceStats.missed}</Badge>
                    <Badge colorScheme="yellow" borderRadius="full" px={2} py={1}>Skipped: {adherenceStats.skipped}</Badge>
                  </HStack>
                </StatHelpText>
              </>
            ) : null}
          </Stat>
        </Flex>
      </CardBody>
    </Card>
  </SimpleGrid>
);

export default StatsCards; 