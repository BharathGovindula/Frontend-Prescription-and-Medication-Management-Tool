import React from 'react';
import { Box, Heading, HStack, Button, Spinner, Text } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';

const TrendsChart = ({ trendView, setTrendView, trendsLoading, trendsError, trends }) => (
  <Box mb={8}>
    <Heading size="md" mb={4} color="gray.800">Adherence & Usage Trends</Heading>
    <HStack mb={4} spacing={4}>
      <Button colorScheme={trendView === 'daily' ? 'blue' : 'gray'} onClick={() => setTrendView('daily')}>Daily</Button>
      <Button colorScheme={trendView === 'weekly' ? 'blue' : 'gray'} onClick={() => setTrendView('weekly')}>Weekly</Button>
      <Button colorScheme={trendView === 'monthly' ? 'blue' : 'gray'} onClick={() => setTrendView('monthly')}>Monthly</Button>
    </HStack>
    {trendsLoading ? (
      <Spinner size="lg" />
    ) : trendsError ? (
      <Text color="red.500">{trendsError}</Text>
    ) : (
      <Bar
        data={{
          labels: (trends[trendView] || []).map(d => d.date || d.week || d.month),
          datasets: [
            {
              label: 'Taken',
              data: (trends[trendView] || []).map(d => d.taken),
              backgroundColor: 'rgba(72,187,120,0.7)',
            },
            {
              label: 'Missed',
              data: (trends[trendView] || []).map(d => d.missed),
              backgroundColor: 'rgba(245,101,101,0.7)',
            },
            {
              label: 'Skipped',
              data: (trends[trendView] || []).map(d => d.skipped),
              backgroundColor: 'rgba(236,201,75,0.7)',
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: false },
          },
          scales: {
            x: { title: { display: true, text: trendView.charAt(0).toUpperCase() + trendView.slice(1) } },
            y: { title: { display: true, text: 'Doses' }, beginAtZero: true },
          },
        }}
        height={120}
      />
    )}
  </Box>
);

export default TrendsChart; 