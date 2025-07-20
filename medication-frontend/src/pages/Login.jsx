import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Alert,
  Text,
  Link,
  VStack,
  Container,
  Flex,
  Image,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Icon,
  useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import logo from '../assets/react.svg';

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate('/dashboard');
    } else if (login.rejected.match(resultAction)) {
      toast({
        title: 'Login failed',
        description: resultAction.error?.message || 'Invalid credentials',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={10}>
      <Flex minH="80vh" align="center" justify="center">
        <Box 
          w={['full', 'full', '450px']} 
          p={8} 
          borderWidth="1px" 
          borderRadius="xl" 
          borderColor={borderColor}
          boxShadow="xl"
          bg={bgColor}
        >
          <VStack spacing={6} align="center" mb={8}>
            <Image src={logo} alt="MedTrack Logo" h="60px" />
            <Heading 
              as="h1" 
              size="xl" 
              bgGradient="linear(to-r, brand.500, accent.500)" 
              bgClip="text"
              fontWeight="bold"
              textAlign="center"
            >
              Welcome Back
            </Heading>
            <Text fontSize="md" color="gray.500" textAlign="center">
              Sign in to access your medications and prescriptions
            </Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl id="email" isRequired>
                <FormLabel fontWeight="medium">Email</FormLabel>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your.email@example.com"
                  size="lg"
                  borderRadius="md"
                  focusBorderColor="brand.500"
                />
              </FormControl>
              
              <FormControl id="password" isRequired>
                <FormLabel fontWeight="medium">Password</FormLabel>
                <InputGroup size="lg">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    borderRadius="md"
                    focusBorderColor="brand.500"
                  />
                  <InputRightElement width="3rem">
                    <Button
                      h="1.5rem"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <Button 
                type="submit" 
                w="full" 
                size="lg"
                isLoading={loading} 
                bgGradient="linear(to-r, brand.500, accent.500)"
                color="white"
                _hover={{ 
                  bgGradient: "linear(to-r, brand.600, accent.600)", 
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 128, 255, 0.3)"
                }}
                _active={{ transform: "translateY(0)" }}
                borderRadius="md"
                mt={2}
              >
                Sign In
              </Button>
              
              <Flex w="full" justify="space-between" fontSize="sm" mt={2}>
                <Link color="brand.500" href="/request-password-reset">
                  Forgot password?
                </Link>
                <Text>
                  Don't have an account?{" "}
                  <Link as={RouterLink} to="/register" color="brand.500" fontWeight="semibold">
                    Sign up
                  </Link>
                </Text>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Container>
  );
};

export default Login;