import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useGetExample } from '../useApi'; // Adjust the import path to your API hooks file

const HomePage = () => {
  // Assuming useGetExample is a hook. If it's not a hook, you'll need to adjust the usage.
  const { data, refetch, isLoading, isError } = useGetExample({ enabled: false });

  const handleFetchExample = async () => {
    try {
      const exampleData = await refetch(); // Fetches the example endpoint data
      console.log(exampleData.data); // Log the response data to the console
    } catch (error) {
      console.error("Failed to fetch example data:", error);
    }
  };

  return (
    <Box padding="4">
      <Heading as="h2" size="lg" marginBottom="2">Home</Heading>
      <Text>Search area component here...</Text>
      <Text>Resume videos list here...</Text>
      <Text>Recommended videos list here...</Text>
      <Button
        onClick={handleFetchExample}
        isLoading={isLoading}
        loadingText="Fetching..."
        colorScheme="teal"
        variant="outline"
        marginTop="4"
      >
        Fetch Example
      </Button>
      {isError && <Text color="red.500">Failed to fetch example data</Text>}
    </Box>
  );
};

export default HomePage;
