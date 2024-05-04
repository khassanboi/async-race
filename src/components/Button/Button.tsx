import './ButtonStyles.css';

interface ButtonProps {
  children: string;
  className: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={'btn ' + props.className}
      type={props.type}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
