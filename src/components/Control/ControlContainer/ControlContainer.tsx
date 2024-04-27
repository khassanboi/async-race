import React from 'react';
import './ControlContainerStyles.css';

interface ControlContainerProps {
  children: React.ReactNode;
}

export const ControlContainer = (props: ControlContainerProps) => {
  return <div className="control__container">{props.children}</div>;
};
