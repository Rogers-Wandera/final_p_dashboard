import React from "react";
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const CardComponent: React.FC<CardProps> = ({ className, children }) => (
  <div className={`card ${className ? className : ""}`}>{children}</div>
);
const CardHeader: React.FC<CardProps> = ({ className, children }) => (
  <div
    className={`card-header d-flex justify-content-between ${
      className ? className : ""
    }`}
  >
    {" "}
    {children}{" "}
  </div>
);
const CardBody: React.FC<CardProps> = ({ className, children }) => (
  <div className={`card-body ${className ? className : ""}`}> {children} </div>
);
const CardFooter: React.FC<CardProps> = ({ children }) => (
  <div className="card-footer"> {children} </div>
);
const CardHeaderTitle: React.FC<CardProps> = ({ className, children }) => (
  <div className={`header-title ${className ? className : ""}`}>
    {" "}
    {children}{" "}
  </div>
);
const CardHeaderAction: React.FC<CardProps> = ({ children, className }) => (
  <div className={`header-action ${className ? className : ""}`}>
    {" "}
    {children}{" "}
  </div>
);
interface CardComposition {
  Header: React.FC<CardProps> & {
    Title?: React.FC<CardProps>;
    Action?: React.FC<CardProps>;
  };
  Body: React.FC<CardProps>;
  Footer: React.FC<CardProps>;
  HeaderTitle: React.FC<CardProps>;
  HeaderAction: React.FC<CardProps>;

  // Add other subcomponents as needed
}
const Card: React.FC<CardProps> & CardComposition = CardComponent as any;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header.Title = CardHeaderTitle;
Card.Header.Action = CardHeaderAction;

export default Card;
