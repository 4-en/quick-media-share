import React from 'react';
import {
  Box, Flex, Input, IconButton, Heading, useColorMode, Menu, MenuButton, MenuList, MenuItem, Spacer
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex as="header" align="center" padding="4" bg={colorMode === 'dark' ? "gray.800" : "gray.200"} color={colorMode === 'dark' ? "white" : "black"} position="relative">

      {/* Left Section: Burger Menu for Navigation */}
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FaBars />}
          variant="ghost"
          aria-label="Options"
          size="lg" // Ensure sufficient size for easy interaction
          mr="2" // Add some margin if needed
        />
        <MenuList>
          <MenuItem as={RouterLink} to="/">Home</MenuItem>
          <MenuItem as={RouterLink} to="/navigation">Browse</MenuItem>
          {/* Additional menu items here */}
        </MenuList>
      </Menu>

      <Spacer />

      {/* Center Section: Title, absolutely positioned for centering */}
      <Box position="absolute" left="50%" transform="translateX(-50%)" textAlign="center">
        <Heading size="md" as={RouterLink} to="/">QMS</Heading>
      </Box>

      {/* Right Section: Search and Toggle */}
      <Flex justifySelf="flex-end">
        <Input placeholder="Search files..." width="auto" marginRight="4" />
        <IconButton
          icon={colorMode === 'dark' ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
          aria-label="Toggle dark mode"
          variant="ghost"
        />
      </Flex>
      
    </Flex>
  );
};

export default Header;