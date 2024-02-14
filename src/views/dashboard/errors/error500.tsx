import { Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
// img
import error500 from "../../../assets/images/error/500.png";

interface Error500Props {
  heading: string | " Oops! This Page is Not Found";
  subtitle: string | "The requested page dose not exist.";
  link: string | "/dashboard";
  linkText: string | "Back to Home";
}

const Error500 = ({ heading, subtitle, link, linkText }: Error500Props) => {
  return (
    <>
      <div className="gradient">
        <Container>
          <Image src={error500} className="img-fluid mb-4 w-50" alt="" />
          <h2 className="mb-0 mt-4 text-white">{heading}.</h2>
          <p className="mt-2 text-white">{subtitle}.</p>
          <Link
            className="btn bg-white text-primary d-inline-flex align-items-center"
            to={link}
          >
            {linkText}
          </Link>
        </Container>
        <div className="box">
          <div className="c xl-circle">
            <div className="c lg-circle">
              <div className="c md-circle">
                <div className="c sm-circle">
                  <div className="c xs-circle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error500;
