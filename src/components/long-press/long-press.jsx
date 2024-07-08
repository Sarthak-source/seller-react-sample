import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

/**
 * A custom Box component that detects long presses.
 * When the user presses and holds the box for 4 seconds (4000ms),
 * it triggers the onLongPress callback. Short presses are detected
 * when the user releases the box before the 4-second threshold.
 * @param {object} props - Component props
 * @param {function} props.onLongPress - Callback function triggered on long press detection.
 * @param {React.ReactNode} props.body - The content to display inside the LongPressableBox.
 * @returns {JSX.Element}
 */
export const LongPressableBox = ({ onLongPress, body }) => {
    const theme = useTheme();
    const [pressStartTime, setPressStartTime] = useState(null);
    const pressTimeout = useRef(null);

    /**
     * Handles the mouse down event on the box.
     * Starts a timeout to detect long press after 4 seconds.
     */
    const handleMouseDown = () => {
        setPressStartTime(Date.now());

        // Start a timeout to detect long press after 4 seconds
        pressTimeout.current = setTimeout(() => {
            console.log('Long press detected');
            onLongPress();
        }, 4000);
    };

    /**
     * Handles the mouse up event on the box.
     * Clears the timeout and checks if the press duration was short (< 4 seconds).
     * If short, considers it as a regular click.
     */
    const handleMouseUp = () => {
        // Clear the timeout
        clearTimeout(pressTimeout.current);

        // Check if the press duration is short, consider it as a regular click
        const pressDuration = Date.now() - pressStartTime;
        if (pressDuration < 4000) {
            console.log('Short press detected');
        }
    };

    return (
        <Box
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Handles mouse leave to clear timeout
            sx={{
                cursor: 'pointer', // Show pointer cursor
            }}
        >
            {body}
        </Box>
    );
};

LongPressableBox.propTypes = {
    onLongPress: PropTypes.func.isRequired, // Callback for long press event
    body: PropTypes.node.isRequired, // Content to display inside the LongPressableBox
};
