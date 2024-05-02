import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Scrollbar from 'src/components/scrollbar';

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  const [displayCount, setDisplayCount] = useState(5); // Initial display count

  const handleViewAllClick = () => {
    setDisplayCount(displayCount + 5); // Increment display count by 5
  };

  return (
    <Card sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }} {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.slice(0, displayCount).map((news) => (
            <NewsItem key={news.id} news={news} />
          ))}
        </Stack>
      </Scrollbar>
      {displayCount < list.length && ( // Show "View all" button if there are more items to display
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Box sx={{ p: 2, textAlign: 'right' }}>
            <Button size="small" color="inherit" onClick={handleViewAllClick}>
              View all
            </Button>
          </Box>
        </>
      )}
    </Card>
  );
}
AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

function NewsItem({ news }) {
  const { name, image, description, postedAt } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {name && (
        <Typography  color={name ? 'initial' : 'error'}>{name.charAt(0)}</Typography>
      )}
      <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src='avatarUrl' />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
      {name && (
        <Typography margin={20} color={name ? 'initial' : 'error'}>{name.charAt(0)}</Typography>
      )}
        
        {name && (
        <Typography margin={20} color={name ? 'initial' : 'error'}>{name.charAt(0)}</Typography>
      )}
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {postedAt} QTL
      </Typography>
      
    </Stack>
  );
}


NewsItem.propTypes = {
  news: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
  }),
};
