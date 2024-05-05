import './ButtonStyles.css';

interface ButtonProps {
  children: string;
  className: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  id?: string;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={'btn ' + props.className}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      id={props.id}
    >
      {props.children}
    </button>
  );
};
