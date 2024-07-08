import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

/**
 * A button component that expands on hover and displays additional content.
 * Uses styled-components for styling and transitions.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render inside the button.
 * @param {string|number} props.width - Initial width of the button.
 * @param {function} props.onClick - Function to handle click events on the button.
 * @param {string} props.color - Color value to customize the button's shadow and text color on hover.
 * @returns {JSX.Element}
 */
const ExpandingButton = styled(Box)(({ theme, isHovered, width }) => ({
  width: isHovered ? width : '20px',
  transition: `width ${theme.transitions.duration.standard}ms ease-in-out`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

/**
 * Button component that expands on hover to display additional content.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render inside the button.
 * @param {string|number} props.width - Initial width of the button.
 * @param {function} props.onClick - Function to handle click events on the button.
 * @param {string} props.color - Color value to customize the button's shadow and text color on hover.
 * @returns {JSX.Element}
 */
const HoverExpandButton = ({ children, width, onClick, color }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handles mouse enter event on the button.
   * @param {React.MouseEvent} e - Mouse event object.
   */
  const handleHover = (e) => {
    setIsHovered(true);
    e.currentTarget.style.borderRadius = '8px';
    e.currentTarget.style.boxShadow = `5px 5px 10px ${color}`;
  };

  /**
   * Handles mouse leave event on the button.
   * @param {React.MouseEvent} e - Mouse event object.
   */
  const handleLeave = (e) => {
    setIsHovered(false);
    e.currentTarget.style.boxShadow = 'none';
  };

  const childArray = React.Children.toArray(children);

  return (
    <ExpandingButton
      theme={theme}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      width={width}
      style={{ cursor: 'pointer' }}
      sx={{ paddingY: 1.4 }}
      onClick={onClick}
      isHovered={isHovered}
    >
      {!isHovered &&
        childArray[0] &&
        React.cloneElement(childArray[0], { style: { color } })}

      {isHovered &&
        childArray.map((child, index) => (
          <React.Fragment key={index}>
            <div style={{ marginLeft: '10px' }} />
            {React.cloneElement(child, { style: { color } })}
          </React.Fragment>
        ))}
    </ExpandingButton>
  );
};

HoverExpandButton.propTypes = {
  children: PropTypes.node,
  width: PropTypes.any,
  onClick: PropTypes.func,
  color: PropTypes.string,
};

export default HoverExpandButton;
