import { Row, Col, Image, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PasswordInput, Popover, Progress } from "@mantine/core";

// img
import auth2 from "../../assets/images/auth/02.png";
import { useSnackbar } from "notistack";
import { useAuthUser } from "../../contexts/authcontext";
import { useAppState } from "../../contexts/sharedcontexts";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/hook";
import { loguserout, setLoading } from "../../store/services/auth";
import { handleError } from "../../helpers/utils";
import {
  PasswordRequirement,
  getStrength,
} from "../../components/modals/formmodal/formconfigs";
import { withoutuppercase } from "../../assets/defaults/passwordrequirements";
import { usePostDataMutation } from "../../store/services/apislice";

const ChangePassword = () => {
  let history = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const appstate = useAppState();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const dispatch = useAppDispatch();
  const [resetPassword] = usePostDataMutation({});
  const { id, token, user } = useAuthUser();

  const [popoverOpened, setPopoverOpened] = useState({
    password: false,
    confirmpassword: false,
  });
  const checks = (value: string, confirmcheck: boolean = false) => {
    const req = withoutuppercase.map((requirement, index) => (
      <PasswordRequirement
        key={index}
        label={requirement.label}
        meets={requirement.re.test(value)}
      />
    ));
    if (confirmcheck) {
      req.push(
        <PasswordRequirement
          key="confirmpassword"
          label="Matches password"
          meets={password === confirmpassword}
        />
      );
    }
    return req;
  };

  const strength = (value: string) => {
    return getStrength(value, 8, withoutuppercase);
  };
  const color = (value: string) => {
    return strength(value) === 100
      ? "teal"
      : strength(value) > 50
      ? "yellow"
      : "red";
  };
  const handleResetPassword = async () => {
    try {
      dispatch(setLoading(true));
      const data = await resetPassword({
        url: "/resetpassword/" + id,
        data: { password, confirmpassword },
      });
      if ("error" in data) {
        throw data.error;
      }
      dispatch(setLoading(false));
      appstate?.setSnackBarOpen({
        open: true,
        message: data.data.msg,
        severity: "success",
        position: "top-right",
      });
      dispatch(loguserout({}));
      history("/dashboard");
    } catch (error) {
      dispatch(setLoading(false));
      handleError(error, appstate, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (token === "") {
      history("/");
    }
  }, []);

  useEffect(() => {
    if (user.adminCreated != 1) {
      history("/dashboard");
    }
  }, []);
  return (
    <>
      <section className="login-content">
        <Row className="m-0 align-items-center bg-white vh-100">
          <Col
            md="6"
            className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden"
          >
            <Image
              src={auth2}
              className="img-fluid gradient-main animated-scaleX"
              alt="images"
            />
          </Col>
          <Col md="6" className="p-0">
            <button
              className="btn btn-primary mx-4"
              onClick={() => history(-1)}
            >
              {/* go back arror */}
              <ArrowBackIcon />
            </button>
            <Card className="card-transparent auth-card shadow-none d-flex justify-content-center mb-0">
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
                <h2 className="mb-2">Change Password</h2>
                <p>
                  Your seeing this because your account was created by an admin,
                  and it requires you to change your password, Enter your new
                  password to access your dashboard.
                </p>
                <Form>
                  <Row>
                    <Col lg="12" className="col-lg-12">
                      <Form.Group className="floating-label">
                        <Form.Label htmlFor="email" className="form-label">
                          Password
                        </Form.Label>
                        <Popover
                          opened={popoverOpened.password}
                          position="bottom"
                          width="target"
                          transitionProps={{ transition: "pop" }}
                        >
                          <Popover.Target>
                            <div
                              onFocusCapture={() =>
                                setPopoverOpened({
                                  confirmpassword: false,
                                  password: true,
                                })
                              }
                              onBlurCapture={() =>
                                setPopoverOpened({
                                  ...popoverOpened,
                                  password: false,
                                })
                              }
                            >
                              <PasswordInput
                                withAsterisk
                                placeholder="Your password"
                                value={password}
                                onChange={(event) =>
                                  setPassword(event.currentTarget.value)
                                }
                              />
                            </div>
                          </Popover.Target>
                          <Popover.Dropdown>
                            <Progress
                              color={color(password)}
                              value={strength(password)}
                              size={5}
                              mb="xs"
                            />
                            <PasswordRequirement
                              label="Includes at least 8 characters"
                              meets={password.length > 7}
                            />
                            {checks(password)}
                          </Popover.Dropdown>
                        </Popover>

                        {/*  */}
                        <Form.Label htmlFor="email" className="form-label">
                          Confirm Password
                        </Form.Label>
                        <Popover
                          opened={popoverOpened.confirmpassword}
                          position="bottom"
                          width="target"
                          transitionProps={{ transition: "pop" }}
                        >
                          <Popover.Target>
                            <div
                              onFocusCapture={() =>
                                setPopoverOpened({
                                  password: false,
                                  confirmpassword: true,
                                })
                              }
                              onBlurCapture={() =>
                                setPopoverOpened({
                                  ...popoverOpened,
                                  confirmpassword: false,
                                })
                              }
                            >
                              <PasswordInput
                                withAsterisk
                                placeholder="Your password"
                                value={confirmpassword}
                                onChange={(event) =>
                                  setConfirmPassword(event.currentTarget.value)
                                }
                              />
                            </div>
                          </Popover.Target>
                          <Popover.Dropdown>
                            <Progress
                              color={color(confirmpassword)}
                              value={strength(confirmpassword)}
                              size={5}
                              mb="xs"
                            />
                            <PasswordRequirement
                              label="Includes at least 8 characters"
                              meets={confirmpassword.length > 7}
                            />
                            {checks(confirmpassword, true)}
                          </Popover.Dropdown>
                        </Popover>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    onClick={handleResetPassword}
                    className="mt-3"
                    type="button"
                    variant="primary"
                  >
                    Reset
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <div className="sign-bg sign-bg-right">
              <svg
                width="280"
                height="230"
                viewBox="0 0 431 398"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.05">
                  <rect
                    x="-157.085"
                    y="193.773"
                    width="543"
                    height="77.5714"
                    rx="38.7857"
                    transform="rotate(-45 -157.085 193.773)"
                    fill="#3B8AFF"
                  />
                  <rect
                    x="7.46875"
                    y="358.327"
                    width="543"
                    height="77.5714"
                    rx="38.7857"
                    transform="rotate(-45 7.46875 358.327)"
                    fill="#3B8AFF"
                  />
                  <rect
                    x="61.9355"
                    y="138.545"
                    width="310.286"
                    height="77.5714"
                    rx="38.7857"
                    transform="rotate(45 61.9355 138.545)"
                    fill="#3B8AFF"
                  />
                  <rect
                    x="62.3154"
                    y="-190.173"
                    width="543"
                    height="77.5714"
                    rx="38.7857"
                    transform="rotate(45 62.3154 -190.173)"
                    fill="#3B8AFF"
                  />
                </g>
              </svg>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default ChangePassword;
