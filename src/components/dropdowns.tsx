import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

export interface CustomToggleProps {
  variant: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const CustomToggle = forwardRef<HTMLAnchorElement, CustomToggleProps>(
  ({ children, variant, onClick }, ref) => (
    <Link
      to="/"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className={variant}
      style={{ color: "unset" }}
    >
      {children}
    </Link>
  )
);
export default CustomToggle;
