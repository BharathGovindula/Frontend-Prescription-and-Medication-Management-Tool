import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Link as ChakraLink,
  VStack,
  Image,
  HStack,
  Grid,
  GridItem,
  Container,
  Icon,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
// import logo from "../assets/react.svg";
import medicationIcon from "../assets/medication-icon.svg";
import reminderIcon from "../assets/reminder-icon.svg";
import securityIcon from "../assets/security-icon.svg";
import prescriptionIcon from "../assets/prescription-icon.svg";
import analyticsIcon from "../assets/analytics-icon.svg";
import familyIcon from "../assets/family-icon.svg";

const Feature = ({ title, text, icon }) => {
  return (
    <VStack
      align="start"
      spacing={3}
      p={5}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "lg",
        borderColor: "blue.200",
        borderWidth: "1px",
      }}
    >
      <Box
        p={3}
        bg="blue.50"
        borderRadius="full"
        mb={2}
        transition="all 0.3s ease"
        _groupHover={{ bg: "blue.100" }}
      >
        <Image src={icon} alt={title} boxSize="50px" />
      </Box>
      <Heading
        as="h3"
        size="md"
        color="blue.600"
        transition="color 0.3s ease"
        _groupHover={{ color: "blue.700" }}
      >
        {title}
      </Heading>
      <Text color="gray.600">{text}</Text>
    </VStack>
  );
};

const Testimonial = ({ text, author, role }) => {
  return (
    <Box
      p={6}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      position="relative"
      transition="all 0.3s ease"
      _hover={{
        transform: "scale(1.03)",
        boxShadow: "xl",
      }}
      _before={{
        
        position: "absolute",
        top: "0",
        left: "10px",
        fontSize: "5xl",
        color: "blue.100",
        fontFamily: "serif",
        lineHeight: 1,
      }}
    >
      <Text fontSize="md" fontStyle="italic" mb={5} pt={4} color="gray.700">
        {text}
      </Text>
      <HStack spacing={4}>
        <Flex
          bg="blue.500"
          borderRadius="full"
          w="45px"
          h="45px"
          align="center"
          justify="center"
          color="white"
          fontWeight="bold"
          fontSize="lg"
        >
          {author.charAt(0)}
        </Flex>
        <Box>
          <Text fontWeight="bold" color="gray.800">
            {author}
          </Text>
          <Text fontSize="sm" color="blue.500">
            {role}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

const Landing = () => {
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, blue.200)",
    "linear(to-br, blue.900, blue.700)"
  );

  return (
    <Box>
      {/* Hero Section */}
      <Flex
        minH="100vh"
        direction="column"
        align="center"
        justify="center"
        bgGradient={bgGradient}
        px={{ base: 4, md: 8 }}
        py={20}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "full",
          background: "blue.100",
          filter: "blur(60px)",
          opacity: 0.6,
          zIndex: 0,
        }}
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-5%",
          left: "-5%",
          width: "250px",
          height: "250px",
          borderRadius: "full",
          background: "blue.200",
          filter: "blur(60px)",
          opacity: 0.4,
          zIndex: 0,
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex="1">
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={10}
            alignItems="center"
          >
            <GridItem>
              <VStack
                spacing={6}
                align="flex-start"
                animation="fadeIn 0.8s ease-in-out"
                sx={{
                  "@keyframes fadeIn": {
                    "0%": { opacity: 0, transform: "translateY(20px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Box
                  p={3}
                  bg="blue.50"
                  borderRadius="full"
                  boxShadow="md"
                  animation="float 3s ease-in-out infinite"
                  sx={{
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                  }}
                >
                  <Image
                    src={medicationIcon}
                    alt="Medication Icon"
                    boxSize="80px"
                  />
                </Box>
                <Heading
                  as="h1"
                  size="2xl"
                  color="blue.600"
                  lineHeight="1.2"
                  bgGradient="linear(to-r, blue.600, blue.400)"
                  bgClip="text"
                  fontWeight="extrabold"
                >
                  Simplify Your Medication Management
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="container.md">
                  Take control of your health with our comprehensive
                  prescription and medication management platform. Never miss a
                  dose again.
                </Text>
                <HStack spacing={4} pt={6}>
                  <Button
                    as={Link}
                    to="/register"
                    colorScheme="blue"
                    size="lg"
                    rounded="full"
                    px={8}
                    py={6}
                    fontWeight="bold"
                    boxShadow="md"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "xl",
                      bgGradient: "linear(to-r, blue.500, blue.600)",
                    }}
                    transition="all 0.3s ease"
                    bgGradient="linear(to-r, blue.400, blue.500)"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    as={Link}
                    to="<Login/>"
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    rounded="full"
                    px={8}
                    py={6}
                    borderWidth="2px"
                    _hover={{
                      bg: "blue.50",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s ease"
                  >
                    Sign In
                  </Button>
                </HStack>
              </VStack>
            </GridItem>
            <GridItem display={{ base: "none", lg: "block" }}>
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow="2xl"
                position="relative"
                transform="perspective(1000px) rotateY(-5deg) rotateX(5deg)"
                transition="all 0.5s ease"
                _hover={{
                  transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)",
                }}
                animation="slideIn 0.8s ease-in-out"
                sx={{
                  "@keyframes slideIn": {
                    "0%": {
                      opacity: 0,
                      transform:
                        "perspective(1000px) translateX(50px) rotateY(-15deg)",
                    },
                    "100%": {
                      opacity: 1,
                      transform:
                        "perspective(1000px) rotateY(-5deg) rotateX(5deg)",
                    },
                  },
                }}
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "-15px",
                  left: "-15px",
                  right: "15px",
                  bottom: "15px",
                  borderRadius: "xl",
                  background: "blue.100",
                  zIndex: -1,
                }}
              >
                <svg
                  viewBox="0 0 500 400"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "100%", height: "auto" }}
                >
                  <rect
                    x="50"
                    y="50"
                    width="400"
                    height="300"
                    rx="20"
                    fill="#EDF2F7"
                  />
                  <rect
                    x="80"
                    y="90"
                    width="340"
                    height="60"
                    rx="10"
                    fill="#BEE3F8"
                  />
                  <rect
                    x="80"
                    y="170"
                    width="150"
                    height="150"
                    rx="10"
                    fill="#90CDF4"
                  />
                  <rect
                    x="250"
                    y="170"
                    width="170"
                    height="70"
                    rx="10"
                    fill="#63B3ED"
                  />
                  <rect
                    x="250"
                    y="250"
                    width="170"
                    height="70"
                    rx="10"
                    fill="#4299E1"
                  />
                  <circle cx="155" cy="245" r="30" fill="#3182CE" />
                  <rect
                    x="130"
                    y="290"
                    width="50"
                    height="10"
                    rx="5"
                    fill="#2B6CB0"
                  />
                </svg>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Flex>

      {/* Features Section */}
      <Box
        py={24}
        px={{ base: 4, md: 8 }}
        position="relative"
        overflow="hidden"
        bg="gray.50"
        _before={{
          content: '""',
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          height: "100px",
          bgGradient: "linear(to-b, white, gray.50)",
          zIndex: 1,
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex="2">
          <VStack spacing={16}>
            <VStack
              spacing={4}
              textAlign="center"
              animation="fadeIn 0.8s ease-in-out"
              sx={{
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(20px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Heading
                as="h2"
                size="xl"
                color="blue.600"
                bgGradient="linear(to-r, blue.600, blue.400)"
                bgClip="text"
                fontWeight="extrabold"
              >
                Features Designed for Your Health
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="container.md" px={4}>
                Our platform offers everything you need to manage your
                medications effectively and stay on top of your health.
              </Text>
            </VStack>

            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={8}
              sx={{
                "& > div:nth-of-type(1)": { animationDelay: "0s" },
                "& > div:nth-of-type(2)": { animationDelay: "0.1s" },
                "& > div:nth-of-type(3)": { animationDelay: "0.2s" },
                "& > div:nth-of-type(4)": { animationDelay: "0.3s" },
                "& > div:nth-of-type(5)": { animationDelay: "0.4s" },
                "& > div:nth-of-type(6)": { animationDelay: "0.5s" },
              }}
            >
              <Box
                animation="fadeInUp 0.6s ease-out forwards"
                opacity="0"
                sx={{
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(40px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Feature
                  icon={medicationIcon}
                  title="Medication Tracking"
                  text="Keep track of all your medications, dosages, and schedules in one secure place."
                />
              </Box>
              <Box
                animation="fadeInUp 0.6s ease-out forwards"
                opacity="0"
                sx={{
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(40px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Feature
                  icon={reminderIcon}
                  title="Smart Reminders"
                  text="Receive timely notifications to ensure you never miss a dose again."
                />
              </Box>
              <Box
                animation="fadeInUp 0.6s ease-out forwards"
                opacity="0"
                sx={{
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(40px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Feature
                  icon={prescriptionIcon}
                  title="Prescription Management"
                  text="Easily manage your prescriptions and get refill reminders before you run out."
                />
              </Box>
              <Box
                animation="fadeInUp 0.6s ease-out forwards"
                opacity="0"
                sx={{
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(40px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Feature
                  icon={analyticsIcon}
                  title="Health Analytics"
                  text="Gain insights into your medication adherence and overall health patterns."
                />
              </Box>
              <Box
                animation="fadeInUp 0.6s ease-out forwards"
                opacity="0"
                sx={{
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(40px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Feature
                  icon={securityIcon}
                  title="Secure & Private"
                  text="Your health data is encrypted and protected with the highest security standards."
                />
              </Box>
              <Box
                animation="fadeInUp 0.6s ease-out forwards"
                opacity="0"
                sx={{
                  "@keyframes fadeInUp": {
                    "0%": { opacity: 0, transform: "translateY(40px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Feature
                  icon={familyIcon}
                  title="Family Sharing"
                  text="Help manage medications for family members with multi-user access controls."
                />
              </Box>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={20} px={{ base: 4, md: 8 }}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl" color="blue.600">
                How It Works
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="container.md">
                Getting started is simple and takes just minutes to set up your
                personalized medication management system.
              </Text>
            </VStack>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={8}
            >
              <VStack spacing={4} align="center">
                <Box
                  w="70px"
                  h="70px"
                  borderRadius="full"
                  bg="blue.500"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  1
                </Box>
                <Heading as="h3" size="md" textAlign="center">
                  Create Your Account
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Sign up for free and set up your secure personal profile in
                  just minutes.
                </Text>
              </VStack>

              <VStack spacing={4} align="center">
                <Box
                  w="70px"
                  h="70px"
                  borderRadius="full"
                  bg="blue.500"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  2
                </Box>
                <Heading as="h3" size="md" textAlign="center">
                  Add Your Medications
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Enter your prescriptions and set up your personalized
                  medication schedule.
                </Text>
              </VStack>

              <VStack spacing={4} align="center">
                <Box
                  w="70px"
                  h="70px"
                  borderRadius="full"
                  bg="blue.500"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  3
                </Box>
                <Heading as="h3" size="md" textAlign="center">
                  Receive Reminders
                </Heading>
                <Text textAlign="center" color="gray.600">
                  Get notifications exactly when you need to take your
                  medications.
                </Text>
              </VStack>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box bg="gray.50" py={20} px={{ base: 4, md: 8 }}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl" color="blue.600">
                What Our Users Say
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="container.md">
                Join thousands of satisfied users who have transformed their
                medication management experience.
              </Text>
            </VStack>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={8}
            >
              <Testimonial
                text="This app has completely changed how I manage my medications. The reminders are reliable and the interface is so easy to use."
                author="Sarah Johnson"
                role="User since 2022"
              />
              <Testimonial
                text="As someone who takes multiple medications daily, this tool has been a lifesaver. I never miss a dose now."
                author="Michael Chen"
                role="User since 2021"
              />
              <Testimonial
                text="I use this to help manage my elderly mother's medications. The family sharing feature gives me peace of mind knowing she's taking her medicine correctly."
                author="Jennifer Williams"
                role="User since 2023"
              />
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} px={{ base: 4, md: 8 }} textAlign="center">
        <Container maxW="container.md">
          <VStack spacing={8}>
            <Heading as="h2" size="xl" color="blue.600">
              Ready to Take Control of Your Medication Management?
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Join thousands of users who have simplified their medication
              routines and improved their health outcomes.
            </Text>
            <Button
              as={Link}
              to="/register"
              colorScheme="blue"
              size="lg"
              rounded="full"
              px={10}
              py={7}
              fontSize="xl"
              _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
            >
              Get Started Today
            </Button>
            <Text fontSize="md" color="gray.500">
              Already have an account?{" "}
              <ChakraLink
                as={Link}
                to="/login"
                color="blue.500"
                fontWeight="bold"
              >
                Log in
              </ChakraLink>
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.100" py={10} px={{ base: 4, md: 8 }}>
        <Container maxW="container.xl">
          <VStack spacing={6}>
            <Image src={medicationIcon} alt="Logo" boxSize="50px" />
            <Text textAlign="center" color="gray.600">
              © 2023 Prescription & Medication Management Tool. All rights
              reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
