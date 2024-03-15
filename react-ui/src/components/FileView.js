import { Box, Heading, Text } from '@chakra-ui/react';

const FileView = () => {
  // This component will be expanded to handle different file types
  return (
    <Box padding="4">
      <Heading as="h2" size="lg" marginBottom="2">File View</Heading>
      <Text>This is a placeholder for the file view component. It will be customized based on the file type.</Text>
    </Box>
  );
};

export default FileView;