import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { Link as RouterLink } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
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
  HStack,
  Checkbox
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import logo from '../assets/react.svg';

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [role, setRole] = useState('user');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const resultAction = await dispatch(register({ email, password, role }));
    if (register.fulfilled.match(resultAction)) {
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate('/login');
    } else if (register.rejected.match(resultAction)) {
      toast({
        title: 'Registration failed',
        description: resultAction.error?.message || 'Could not register',
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
          w={['full', 'full', '500px']} 
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
              Create Account
            </Heading>
            <Text fontSize="md" color="gray.500" textAlign="center">
              Join MedTrack to manage your medications and prescriptions
            </Text>
          </VStack>

          {error && (
            <Alert status="error" mb={6} borderRadius="md">
              {error}
            </Alert>
          )}

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
                    placeholder="Create a strong password"
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
              
              <FormControl id="confirm-password" isRequired>
                <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                <InputGroup size="lg">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordsMatch(true); // Reset error when typing
                    }}
                    placeholder="Confirm your password"
                    borderRadius="md"
                    focusBorderColor="brand.500"
                  />
                  <InputRightElement width="3rem">
                    <Button
                      h="1.5rem"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <FormControl id="role" isRequired>
                <FormLabel fontWeight="medium">Role</FormLabel>
                <Input as="select" value={role} onChange={e => setRole(e.target.value)} borderRadius="md" focusBorderColor="brand.500">
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </Input>
              </FormControl>
              
              <FormControl>
                <Checkbox 
                  colorScheme="blue" 
                  isChecked={acceptTerms} 
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                >
                  <Text fontSize="sm">
                    I agree to the{" "}
                    <Link color="brand.500" href="#">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link color="brand.500" href="#">
                      Privacy Policy
                    </Link>
                  </Text>
                </Checkbox>
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
                isDisabled={!acceptTerms}
              >
                Create Account
              </Button>
              
              <Flex w="full" justify="center" fontSize="sm" mt={2}>
                <Text>
                  Already have an account?{" "}
                  <Link as={RouterLink} to="/login" color="brand.500" fontWeight="semibold">
                    Sign in
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

export default Register;