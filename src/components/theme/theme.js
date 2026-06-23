'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D7C66', // Premium Medical Green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F5F7F8', // Very light grey/white
      contrastText: '#1A1A1A',
    },
    warning: {
      main: '#F4B400', // Gold accent
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#F5F7F8', // Secondary color as default bg
      paper: '#ffffff', // Clean white cards/papers
    },
    text: {
      primary: '#1A1A1A', // Dark text
      secondary: '#4A4A4A', // Muted text
    },
    divider: 'rgba(13, 124, 102, 0.08)',
  },
  typography: {
    fontFamily: 'var(--font-hind-siliguri), "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 20px rgba(13, 124, 102, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0D7C66 0%, #16A085 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #0B6A58 0%, #12806A 100%)',
            boxShadow: '0 6px 20px rgba(13, 124, 102, 0.25)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid rgba(13, 124, 102, 0.06)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 30px rgba(13, 124, 102, 0.03)',
        },
      },
    },
  },
});

export default theme;

