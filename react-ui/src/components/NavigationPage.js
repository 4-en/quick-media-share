import React, { useState } from 'react';
import { Box, Heading, Button, Grid, GridItem, VStack, HStack, Icon, Text, useToast, Center } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useListFiles } from '../useApi'; // Adjust the import path as necessary
import { FaThLarge, FaBars, FaFolder, FaFileAlt } from 'react-icons/fa';

const NavigationPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const navigate = useNavigate();
  const { folderPath = '' } = useParams(); // Provide a default value to avoid undefined
  console.log(folderPath); // Check if the folderPath is being captured
  const adjustedPath = folderPath || '/'; // Default to root if no path is specified
  const { data, isLoading, error } = useListFiles(adjustedPath);
  const toast = useToast();

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'list' ? 'grid' : 'list');
  };

  const handleItemClick = (item) => {
    if (item.is_dir) {
      navigate(`/navigate/${item.path}`);
    } else {
      navigate(`/fileview/${item.path}`);
    }
  };

  // Custom sort function
  const sortedData = data?.sort((a, b) => {
    // Prioritize directories over files
    if (a.is_dir && !b.is_dir) {
      return -1;
    }
    if (!a.is_dir && b.is_dir) {
      return 1;
    }
    // If both are files or both are directories, sort alphabetically by path
    return a.path.localeCompare(b.path);
  });

  // Show a toast message if there's an error
  if (error) {
    toast({
      title: "An error occurred.",
      description: error.message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  }

  return (
    <Box padding="4">
      <Heading as="h2" size="lg" marginBottom="4">Browse Files</Heading>
      <Button onClick={toggleViewMode} leftIcon={viewMode === 'list' ? <FaThLarge /> : <FaBars />} marginBottom="4">
        {viewMode === 'list' ? 'Grid View' : 'List View'}
      </Button>
      
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        viewMode === 'grid' ? (
          <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={6}>
            {sortedData && sortedData.map((item, index) => (
              <Center as="button" key={index} onClick={() => handleItemClick(item)}>
                <GridItem textAlign="center">
                  <Icon as={item.is_dir ? FaFolder : FaFileAlt} w={8} h={8} />
                  <Text fontSize="sm">{item.path}</Text>
                </GridItem>
              </Center>
            ))}
          </Grid>
        ) : (
          <VStack align="stretch" spacing={4}>
            {sortedData && sortedData.map((item, index) => (
              <HStack as="button" key={index} spacing={4} onClick={() => handleItemClick(item)}>
                <Icon as={item.is_dir ? FaFolder : FaFileAlt} w={6} h={6} />
                <Text fontSize="md">{item.path}</Text>
              </HStack>
            ))}
          </VStack>
        )
      )}
    </Box>
  );
};


export default NavigationPage;