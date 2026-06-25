
'use client';

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';

const navItems = [
  { label: 'উপকারিতা', id: '#benefits' },
  { label: 'উপাদানসমূহ', id: '#ingredients' },
  { label: 'গ্রাহক রিভিউ', id: '#reviews' },
  { label: 'জিজ্ঞাসা', id: '#faq' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (id) => {
    const element = document.querySelector(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background:
              'linear-gradient(135deg,#0D7C66 0%,#16A085 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <FavoriteIcon />
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.25rem',
          }}
        >
          
          <Box
            component="span"
            sx={{ color: '#0D7C66' }}
          >
            ManPower
          </Box>
        </Typography>
      </Box>

      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => scrollToSection(item.id)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            borderRadius: '999px',
            py: 1.5,
            fontWeight: 700,
            background:
              'linear-gradient(135deg,#0D7C66,#16A085)',

            '&:hover': {
              background:
                'linear-gradient(135deg,#0B6A58,#12806A)',
            },
          }}
        >
          অর্ডার করুন
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Container maxWidth="xl">
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            mt: 2,
            borderRadius: '20px',
            background: scrolled
              ? 'rgba(255,255,255,.92)'
              : 'rgba(255,255,255,.75)',

            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(13,124,102,.08)',

            color: '#0F172A',

            transition: 'all .3s ease',

            boxShadow: scrolled
              ? '0 20px 40px rgba(0,0,0,.08)'
              : '0 8px 25px rgba(0,0,0,.04)',
          }}
        >
          <Toolbar
            sx={{
              minHeight: 78,
              px: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {/* Logo */}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg,#0D7C66,#16A085)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  color: '#fff',

                  boxShadow:
                    '0 10px 20px rgba(13,124,102,.25)',
                }}
              >
                <FavoriteIcon />
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '1.3rem',
                }}
              >
                ManPower
                <Box
                  component="span"
                  sx={{
                    color: '#0D7C66',
                  }}
                >
                  M
                </Box>
              </Typography>
            </Box>

            {/* Desktop Menu */}

            <Box sx={{ flexGrow: 1 }} />

            <Box
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                },
                gap: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() =>
                    scrollToSection(item.id)
                  }
                  sx={{
                    color: '#475569',
                    fontWeight: 600,

                    '&:hover': {
                      background:
                        'rgba(13,124,102,.06)',
                      color: '#0D7C66',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* CTA */}

            <Box
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                },
              }}
            >
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.3,
                  borderRadius: '999px',

                  background:
                    'linear-gradient(135deg,#0D7C66,#16A085)',

                  fontWeight: 700,

                  boxShadow:
                    '0 10px 25px rgba(13,124,102,.25)',

                  '&:hover': {
                    transform:
                      'translateY(-2px)',

                    background:
                      'linear-gradient(135deg,#0B6A58,#12806A)',
                  },
                }}
              >
                অর্ডার করুন
              </Button>
            </Box>

            {/* Mobile */}

            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: {
                  xs: 'flex',
                  md: 'none',
                },

                ml: 'auto',

                border:
                  '1px solid rgba(0,0,0,.08)',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>
    </>
  );
}

