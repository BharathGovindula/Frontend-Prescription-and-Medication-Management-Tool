import React from 'react';
import { Box, Heading, Spinner, Alert, AlertIcon, HStack, Text, Tooltip, Progress, Button } from '@chakra-ui/react';
import { FaFire, FaMedal, FaShareAlt } from 'react-icons/fa';
import Confetti from 'react-confetti';

const AdherenceStreaks = ({ showConfetti, streaksLoading, streaksError, streaks, nextBadge, progressToNext, handleShare }) => (
  <Box mb={6}>
    {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />}
    <Heading as="h2" size="md" mb={2}>Adherence Streaks & Badges</Heading>
    {streaksLoading ? (
      <Spinner size="md" />
    ) : streaksError ? (
      <Alert status="error"><AlertIcon />{streaksError}</Alert>
    ) : (
      <Box p={4} borderRadius="lg" boxShadow="md" bg={streaks.currentStreak >= 7 ? 'yellow.100' : streaks.currentStreak >= 3 ? 'gray.100' : 'white'} transition="background 0.5s">
        <HStack spacing={6} align="center" flexWrap="wrap">
          <Box minW="180px">
            <HStack>
              <FaFire color="#F56565" size={32} />
              <Text fontWeight="bold" fontSize="lg">Current Streak:</Text>
              <Text fontSize="2xl">{streaks.currentStreak} day{streaks.currentStreak === 1 ? '' : 's'}</Text>
            </HStack>
            <HStack>
              <FaFire color="#3182CE" size={24} />
              <Text fontWeight="bold">Longest Streak:</Text>
              <Text>{streaks.longestStreak} day{streaks.longestStreak === 1 ? '' : 's'}</Text>
            </HStack>
          </Box>
          <Box minW="180px">
            <Text fontWeight="bold" mb={1}>Badges:</Text>
            <HStack spacing={3} flexWrap="wrap">
              {streaks.badges.length > 0 ? streaks.badges.map((badge, idx) => (
                <Tooltip key={idx} label={`Earned for a ${badge.split('-')[0]} streak`} hasArrow>
                  <Box animation="fadeIn 0.8s" as="span">
                    <FaMedal color="#ECC94B" size={32} style={{ filter: 'drop-shadow(0 2px 4px #ECC94B88)' }} />
                    <Text fontSize="sm" textAlign="center">{badge}</Text>
                  </Box>
                </Tooltip>
              )) : <Text fontSize="sm">No badges yet</Text>}
            </HStack>
          </Box>
          <Box minW="220px">
            {nextBadge && (
              <Box>
                <Text fontWeight="bold" mb={1}>Next Badge:</Text>
                <HStack>
                  <FaMedal color="#CBD5E1" size={28} />
                  <Text fontSize="sm">{nextBadge.label} ({nextBadge.days} days)</Text>
                </HStack>
                <Progress value={progressToNext} size="sm" colorScheme="yellow" borderRadius="md" mt={1} />
                <Text fontSize="xs" color="gray.500">{streaks.currentStreak}/{nextBadge.days} days</Text>
              </Box>
            )}
          </Box>
          <Box minW="100px">
            <Button leftIcon={<FaShareAlt />} colorScheme="blue" size="sm" onClick={handleShare} variant="outline">Share</Button>
          </Box>
        </HStack>
      </Box>
    )}
  </Box>
);

export default AdherenceStreaks; 