import { Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import mail from "../../assets/images/auth/03.png";
import Card from "../../components/Card";
import { handleError } from "../../helpers/utils";
import { useAppState } from "../../contexts/sharedcontexts";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { useAuthUser } from "../../contexts/authcontext";
import { useAppDispatch } from "../../hooks/hook";
import {
  setLoading,
  setLoggedIn,
  setToken,
  setUser,
} from "../../store/services/auth";

const VerifyEmail = () => {
  const appstate = useAppState();
  const authuser = useAuthUser();
  const dispatch = useAppDispatch();
  const handleResendCode = async () => {
    try {
      dispatch(setLoading(true));
      const data = await axios.get(
        `${import.meta.env.VITE_NODE_BASE_URL}/regenerate/code`,
        {
          headers: {
            Authorization: `Bearer ${authuser.token}`,
          },
        }
      );
      dispatch(setLoading(false));
      enqueueSnackbar(data.data.msg, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
        hideIconVariant: true,
      });
      dispatch(setUser({}));
      dispatch(setLoggedIn(false));
      dispatch(setToken(""));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setUser({}));
      dispatch(setLoggedIn(false));
      dispatch(setToken(""));
      handleError(error, appstate, enqueueSnackbar);
    }
  };
  return (
    <>
      <section className="login-content">
        <Row className="m-0 align-items-center bg-white vh-100">
          <Col md="6" className="p-0">
            <Card className="card-transparent auth-card shadow-none d-flex justify-content-center mb-3">
              <Card.Body>
                <Link
                  to="/dashboard"
                  className="navbar-brand d-flex align-items-center mb-3"
                >
                  <svg
                    width="30"
                    className="text-primary"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="-0.757324"
                      y="19.2427"
                      width="28"
                      height="4"
                      rx="2"
                      transform="rotate(-45 -0.757324 19.2427)"
                      fill="currentColor"
                    />
                    <rect
                      x="7.72803"
                      y="27.728"
                      width="28"
                      height="4"
                      rx="2"
                      transform="rotate(-45 7.72803 27.728)"
                      fill="currentColor"
                    />
                    <rect
                      x="10.5366"
                      y="16.3945"
                      width="16"
                      height="4"
                      rx="2"
                      transform="rotate(45 10.5366 16.3945)"
                      fill="currentColor"
                    />
                    <rect
                      x="10.5562"
                      y="-0.556152"
                      width="28"
                      height="4"
                      rx="2"
                      transform="rotate(45 10.5562 -0.556152)"
                      fill="currentColor"
                    />
                  </svg>
                  <h4 className="logo-title ms-3">MBRS</h4>
                </Link>
                <h2 className="mt-3 mb-0">
                  401 Unauthorized !{" "}
                  <small style={{ fontSize: "18px" }}>
                    Please verify your email
                  </small>
                </h2>
                <p className="cnf-mail mb-1">
                  An email has been sent to your registered mail. Please check
                  for an email from MBRS and click on the included link to
                  verify your account.
                </p>
                <h6>
                  If you didnt recieve the code please click the button below to
                  resend the code
                </h6>
                <div className="d-inline-block w-100">
                  <button
                    onClick={handleResendCode}
                    type="button"
                    className="btn btn-primary mt-3"
                  >
                    Resend Code
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col
            md="6"
            className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden"
          >
            <Image
              src={mail}
              className="img-fluid gradient-main animated-scaleX"
              alt="images"
            />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default VerifyEmail;
