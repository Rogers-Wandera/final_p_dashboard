import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
// img
const Error401 = () => {
  return (
    <>
      <div className="gradient">
        <Container>
          <h1>401</h1>
          <h2 className="mb-0 mt-4 text-white">
            Oops! You have no access rights to view this page.
          </h2>
          <p className="mt-2 text-white">
            The rights might not be assigned or they expired please contact
            admin.
          </p>
          <Link
            className="btn bg-white text-primary d-inline-flex align-items-center"
            to="/dashboard"
          >
            Back to Home
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

export default Error401;
