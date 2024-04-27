import "./ButtonStyles.css";

interface ButtonProps {
  children: string;
  className: string;
}

export const Button = (props: ButtonProps) => {
  return <button className={"btn " + props.className}>{props.children}</button>;
};
