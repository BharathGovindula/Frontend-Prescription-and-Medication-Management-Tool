import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { 
  Box, 
  Flex, 
  Button, 
  Spacer, 
  Image, 
  Heading, 
  HStack, 
  Container, 
  useColorModeValue, 
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useColorMode
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import logo from '../assets/react.svg';

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  // For PWA installation
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);
  
  // For scroll effect
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    // PWA installation prompt handler
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    // Scroll position handler
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Background color based on scroll position
  const bgColor = useColorModeValue(
    scrollPosition > 50 ? "white" : "rgba(255, 255, 255, 0.9)",
    scrollPosition > 50 ? "gray.800" : "rgba(26, 32, 44, 0.9)"
  );
  
  // Shadow based on scroll position
  const boxShadow = scrollPosition > 50 ? "0 4px 20px rgba(0,0,0,0.1)" : "none";

  return (
    <Box 
      as="nav" 
      position="sticky" 
      top="0" 
      left="0" 
      right="0" 
      zIndex="1000" 
      bg={bgColor}
      backdropFilter="blur(8px)"
      boxShadow={boxShadow}
      transition="all 0.3s ease"
    >
      <Container maxW="container.xl">
        <Flex 
          h="70px" 
          alignItems="center" 
          justifyContent="space-between"
        >
          {/* Logo */}
          <Flex alignItems="center">
            <Link to="/">
              <Flex alignItems="center">
                <Image src={logo} alt="MedTrack Logo" h="35px" mr={2} />
                <Heading 
                  as="h1" 
                  size="md" 
                  bgGradient="linear(to-r, brand.500, accent.500)" 
                  bgClip="text"
                  fontWeight="bold"
                >
                  MedTrack
                </Heading>
              </Flex>
            </Link>
          </Flex>
          
          {/* Desktop Navigation */}
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            {isAuthenticated && (
              <>
                <Button 
                  as={Link} 
                  to="/dashboard" 
                  variant="ghost" 
                  colorScheme="blue"
                  fontWeight="medium"
                  isActive={location.pathname === '/dashboard'}
                >
                  Dashboard
                </Button>
                <Button 
                  as={Link} 
                  to="/upload" 
                  variant="ghost" 
                  colorScheme="blue"
                  fontWeight="medium"
                  isActive={location.pathname === '/upload'}
                >
                  Upload Prescription
                </Button>
                <Menu>
                  <MenuButton 
                    as={Button} 
                    rightIcon={<ChevronDownIcon />}
                    variant="ghost"
                    colorScheme="blue"
                  >
                    Notifications
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} to="/notifications">Notification Center</MenuItem>
                    <MenuItem as={Link} to="/notification-preferences">Preferences</MenuItem>
                    <MenuItem as={Link} to="/notification-permission-test">Permission Test</MenuItem>
                  </MenuList>
                </Menu>
                <Button 
                  as={Link} 
                  to="/profile" 
                  variant="ghost" 
                  colorScheme="blue"
                  fontWeight="medium"
                  isActive={location.pathname === '/profile'}
                >
                  Profile
                </Button>
                <Button 
                  as={Link} 
                  to="/reports" 
                  variant="ghost" 
                  colorScheme="blue"
                  fontWeight="medium"
                  isActive={location.pathname === '/reports'}
                >
                  Reports
                </Button>
              </>
            )}
          </HStack>
          
          {/* Action Buttons */}
          <HStack spacing={4}>
            {!isAuthenticated ? (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline" 
                  colorScheme="blue" 
                  size={{ base: "sm", md: "md" }}
                  display={{ base: "none", sm: "inline-flex" }}
                >
                  Sign In
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  colorScheme="blue" 
                  size={{ base: "sm", md: "md" }}
                  bgGradient="linear(to-r, brand.500, accent.500)"
                  _hover={{ 
                    bgGradient: "linear(to-r, brand.600, accent.600)", 
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 128, 255, 0.3)"
                  }}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleLogout} 
                colorScheme="red" 
                size={{ base: "sm", md: "md" }}
                display={{ base: "none", sm: "inline-flex" }}
              >
                Logout
              </Button>
            )}
            
            {installable && (
              <Button 
                colorScheme="green" 
                size={{ base: "sm", md: "md" }} 
                onClick={handleInstall}
                display={{ base: "none", sm: "inline-flex" }}
              >
                Install App
              </Button>
            )}
            
            <IconButton
              aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              size={{ base: 'sm', md: 'md' }}
            />
            
            {/* Mobile menu button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open menu"
              fontSize="20px"
              variant="ghost"
              icon={<HamburgerIcon />}
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex alignItems="center">
              <Image src={logo} alt="MedTrack Logo" h="30px" mr={2} />
              <Heading 
                as="h2" 
                size="md" 
                bgGradient="linear(to-r, brand.500, accent.500)" 
                bgClip="text"
                fontWeight="bold"
              >
                MedTrack
              </Heading>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {isAuthenticated ? (
                <>
                  <Button as={Link} to="/dashboard" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                    Dashboard
                  </Button>
                  <Button as={Link} to="/upload" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                    Upload Prescription
                  </Button>
                  <Button as={Link} to="/notifications" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                    Notifications
                  </Button>
                  <Button as={Link} to="/notification-preferences" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                    Notification Preferences
                  </Button>
                  <Button as={Link} to="/profile" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                    Profile
                  </Button>
                  <Button as={Link} to="/reports" variant="ghost" justifyContent="flex-start" onClick={onClose}>
                    Reports
                  </Button>
                  <Button onClick={() => { handleLogout(); onClose(); }} colorScheme="red" mt={4}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="outline" colorScheme="blue" onClick={onClose}>
                    Sign In
                  </Button>
                  <Button 
                    as={Link} 
                    to="/register" 
                    colorScheme="blue" 
                    bgGradient="linear(to-r, brand.500, accent.500)"
                    onClick={onClose}
                  >
                    Get Started
                  </Button>
                </>
              )}
              {installable && (
                <Button colorScheme="green" onClick={() => { handleInstall(); onClose(); }} mt={4}>
                  Install App
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;