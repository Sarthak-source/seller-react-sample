import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

export const LongPressableBox = ({ onLongPress, body }) => {
    const theme = useTheme();
    const [pressStartTime, setPressStartTime] = useState(null);
    const pressTimeout = useRef(null);

    const handleMouseDown = () => {
        setPressStartTime(Date.now());

        // Start a timeout to detect long press
        pressTimeout.current = setTimeout(() => {
            console.log('Long press');
            onLongPress();
        }, 4000);
    };

    const handleMouseUp = () => {
        // Clear the timeout
        clearTimeout(pressTimeout.current);

        // Check if the press duration is short, consider it as a regular click
        const pressDuration = Date.now() - pressStartTime;
        if (pressDuration < 4000) {
            console.log('Short press');
        }
    };

    return (
        <Box
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
                cursor: 'pointer', // Show pointer cursor
            }}
        >
            {body}
        </Box>
    );
};

LongPressableBox.propTypes = {
    onLongPress: PropTypes.func.isRequired,
    body: PropTypes.node.isRequired,
};
