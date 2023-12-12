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

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 82;

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

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const pathname = usePathname();

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredNavConfig = navConfig.filter((item) =>
    item.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const theme = useTheme();

  const capitalizeFirstLetter = (str) => (
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
  

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" color="primary.main" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder="Search for page…"
              value={searchInput}
              onChange={handleSearchInputChange}
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />

            <IconButton onClick={handleClose}>
              <Iconify icon="eva:search-fill" color="primary.main" />
            </IconButton>
          </StyledSearchbar>
        </Slide>

        {/* List component */}
        {open && (
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
                   height:50,
                    color: 'text.secondary',
                    ...bgBlur({
                      color: theme.palette.background.default,
                    }),
                    ...(item.path === pathname && {
                      color: 'primary.main',
                    }),
                  }}
                >
                  <Box component="span" sx={{ width: 24, height: 24, ml: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography  style={{ paddingLeft: 20, fontWeight: 'bold' }} >
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