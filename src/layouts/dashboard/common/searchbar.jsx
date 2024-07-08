import { useTheme } from '@emotion/react';
import { Box, List, ListItem, Paper, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { usePathname } from 'src/routes/hooks';
import { bgBlur } from 'src/theme/css';
import navConfig from '../config-navigation';

// ----------------------------------------------------------------------

// Constants for header heights on mobile and desktop views
const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 82;

// Styled component for the search bar
const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({
    color: theme.palette.background.default,
  }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

/**
 * Searchbar component for filtering navigation items based on user input.
 * Displays a search input and dynamically filters navigation items from `navConfig`.
 */
export default function Searchbar() {
  const [open, setOpen] = useState(false); // State to manage the visibility of the search bar
  const [searchInput, setSearchInput] = useState(''); // State to store the current search input
  const pathname = usePathname(); // Hook to get the current pathname of the router

  // Toggle function to open/close the search bar
  const handleOpen = () => {
    setOpen(!open);
  };

  // Function to close the search bar
  const handleClose = () => {
    setOpen(false);
  };

  // Handler for updating search input state based on user input
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Filtering navigation items based on search input
  const filteredNavConfig = navConfig.filter((item) =>
    item.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const theme = useTheme(); // Accessing theme object from MUI

  // Function to capitalize the first letter of each word in a string
  const capitalizeFirstLetter = (str) => (
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {/* IconButton to open the search bar */}
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" color="primary.main" />
          </IconButton>
        )}

        {/* Slide animation for the search bar */}
        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            {/* Input field for searching */}
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search for page…"
              value={searchInput}
              onChange={handleSearchInputChange}
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />

            {/* IconButton to close the search bar */}
            <IconButton onClick={handleClose}>
              <Iconify icon="eva:search-fill" color="primary.main" />
            </IconButton>
          </StyledSearchbar>
        </Slide>

        {/* List component to display filtered search results */}
        {open && searchInput && (
          <Paper
            elevation={0}
            style={{
              position: 'absolute',
              top: HEADER_MOBILE + 10,
              left: 0,
              zIndex: 98,
              width: '100%',
            }}
          >
            <List>
              {filteredNavConfig.map((item) => (
                <ListItem
                  key={item.path}
                  onClick={handleClose}
                  component={RouterLink}
                  href={item.path}
                  sx={{
                    height: 50,
                    color: 'text.secondary',
                    ...bgBlur({
                      color: theme.palette.background.default,
                    }),
                    ...(item.path === pathname && {
                      color: 'primary.main',
                    }),
                  }}
                >
                  {/* Icon for the navigation item */}
                  <Box component="span" sx={{ width: 24, height: 24, ml: 2 }}>
                    {item.icon}
                  </Box>

                  {/* Title of the navigation item */}
                  <Typography style={{ paddingLeft: 20, fontWeight: 'bold' }}>
                    {capitalizeFirstLetter(item.title)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
}
