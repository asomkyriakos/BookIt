import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const variantClass = variant === "primary" ? "" : ` button--${variant}`;

  return (
    <button
      className={`button${variantClass}${className ? ` ${className}` : ""}`}
      type={type}
      {...props}
    />
  );
}
