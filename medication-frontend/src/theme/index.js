import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Custom colors
const colors = {
  brand: {
    50: '#e6f7ff',
    100: '#b3e0ff',
    200: '#80caff',
    300: '#4db3ff',
    400: '#1a9dff',
    500: '#0080ff', // Primary brand color
    600: '#0066cc',
    700: '#004d99',
    800: '#003366',
    900: '#001a33',
  },
  accent: {
    50: '#e6fff9',
    100: '#b3ffed',
    200: '#80ffe0',
    300: '#4dffd4',
    400: '#1affc7',
    500: '#00ffbb', // Secondary accent color
    600: '#00cc96',
    700: '#009970',
    800: '#00664b',
    900: '#003325',
  },
};

// Custom fonts
const fonts = {
  heading: '"Inter", sans-serif',
  body: '"Inter", sans-serif',
};

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'md',
      _focus: {
        boxShadow: 'outline',
      },
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === 'blue' ? 'brand.500' : undefined,
        _hover: {
          bg: props.colorScheme === 'blue' ? 'brand.600' : undefined,
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.3s ease',
      }),
      outline: (props) => ({
        borderColor: props.colorScheme === 'blue' ? 'brand.500' : undefined,
        color: props.colorScheme === 'blue' ? 'brand.500' : undefined,
        _hover: {
          bg: props.colorScheme === 'blue' ? 'brand.50' : undefined,
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
      }),
      ghost: (props) => ({
        _hover: {
          bg: props.colorScheme === 'blue' ? 'brand.50' : undefined,
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
      }),
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
      lineHeight: 'shorter',
    },
  },
  Box: {
    baseStyle: {
      borderRadius: 'md',
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        boxShadow: 'md',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        _hover: {
          transform: 'translateY(-5px)',
          boxShadow: 'xl',
        },
      },
    },
  },
  Link: {
    baseStyle: {
      _hover: {
        textDecoration: 'none',
      },
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderRadius: 'md',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
  },
};

// Global styles
const styles = {
  global: (props) => ({
    body: {
      bg: mode('gray.50', 'gray.900')(props),
      color: mode('gray.800', 'whiteAlpha.900')(props),
    },
  }),
};

// Custom breakpoints
const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
};

// Animation keyframes
const layerStyles = {
  gradientBg: {
    bgGradient: 'linear(to-br, blue.50, blue.200)',
    _dark: {
      bgGradient: 'linear(to-br, blue.900, blue.700)',
    },
  },
};

// Create the theme
const theme = extendTheme({
  colors,
  fonts,
  components,
  styles,
  breakpoints,
  layerStyles,
});

export default theme;