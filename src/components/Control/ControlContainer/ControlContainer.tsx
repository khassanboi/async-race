import React from 'react';
import './ControlContainerStyles.css';

interface ControlContainerProps {
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent) => void;
}

export const ControlContainer = (props: ControlContainerProps) => {
  return (
    <form className="control__container" onSubmit={props.onSubmit}>
      {props.children}
    </form>
  );
};
