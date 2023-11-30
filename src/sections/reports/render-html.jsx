import { Box, Paper, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { useState } from 'react';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';


const RenderHtmlFromLink = ({ link }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHtml = async () => {
    try {
      const response = await fetch(link);
      const html = await response.text();

      console.log(html)
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const navbarElement = doc.querySelector('.navbar');
      if (navbarElement) {
        navbarElement.remove();
      }

      const sanitizedHtml = DOMPurify.sanitize(doc.documentElement.innerHTML, { FORCE_BODY: true });

      const styledHtml = `
        <html>
          <head>
            <style>
              table {
                width: 100%;
                margin-top: 20px;
                border-collapse: collapse;
              }
            </style>
          </head>
          <body>
            ${sanitizedHtml}
          </body>
        </html>
      `;

      console.log(styledHtml)

      setHtmlContent(styledHtml);
    } catch (error) {
      console.error('Error fetching HTML:', error);
    } finally {
      setLoading(false);
    }
  };


  fetchHtml();


  return (
    <Paper elevation={3} style={{ margin: '16px 0', maxHeight: '100%', overflow: 'auto' }}>
      {!loading ? (
        <Typography variant="body1" sx={{ px: '30px', mb: '20px' }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <SkeletonLoader />
        </Box>
      )}
    </Paper>
  );
};

RenderHtmlFromLink.propTypes = {
  link: PropTypes.string.isRequired,
};

export default RenderHtmlFromLink;
