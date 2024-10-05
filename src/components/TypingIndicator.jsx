import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 1
      }}
    >
      <CircularProgress size={20} sx={{ marginRight: 1 }} />
      <Typography variant="body2">The bot is typing...</Typography>
    </Box>
  );
};

export default TypingIndicator;