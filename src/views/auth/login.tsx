import React, { useState } from "react";
import { Row, Col, Image, Form, Button } from "react-bootstrap"; //ListGroup
import { Link, Navigate, useNavigate } from "react-router-dom";
import Card from "../../components/Card";

// img
// import facebook from "../../assets/images/brands/fb.svg";
// import google from "../../assets/images/brands/gm.svg";
// import instagram from "../../assets/images/brands/im.svg";
// import linkedin from "../../assets/images/brands/li.svg";
import auth1 from "../../assets/images/auth/01.png";
import { setLoading, useLoginUserMutation } from "../../store/services/auth";
import { useAppState } from "../../contexts/sharedcontexts";
import { useSnackbar } from "notistack";
import { handleError } from "../../helpers/utils";
import { useAuthUser } from "../../contexts/authcontext";
import { useAppDispatch } from "../../hooks/hook";
import { PasswordInput, Popover, Progress, TextInput } from "@mantine/core";
import {
  PasswordRequirement,
  getStrength,
} from "../../components/modals/formmodal/formconfigs";
import { withoutuppercase } from "../../assets/defaults/passwordrequirements";
import { setManual } from "../../store/services/defaults";

const Login = () => {
  let history = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoggedIn, token } = useAuthUser();
  if (isLoggedIn && token !== "") {
    return <Navigate to="/dashboard" />;
  }
  const appstate = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser] = useLoginUserMutation();
  const dispatch = useAppDispatch();

  const [popoverOpened, setPopoverOpened] = useState(false);
  const checks = withoutuppercase.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(password)}
    />
  ));

  // useEffect(() => {
  //   if (isLoggedIn && token !== "") {
  //     history("/dashboard");
  //   }
  // }, []);

  const strength = getStrength(password, 8, withoutuppercase);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const data = await loginUser({ email, password });
      if ("error" in data) {
        throw data.error;
      }
      dispatch(setLoading(false));
      dispatch(setManual(true));
      appstate?.setSnackBarOpen({
        open: true,
        message: data.data.msg,
        severity: "success",
        position: "top-right",
      });
      history("/dashboard");
    } catch (error) {
      dispatch(setLoading(false));
      handleError(error, appstate, enqueueSnackbar);
    }
  };
  return (
    <>
      <section className="login-content">
        <Row className="m-0 align-items-center bg-white vh-100">
          <Col md="6">
            <Row className="justify-content-center">
              <Col md="10">
                <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
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
                    <h2 className="mb-2 text-center">Sign In</h2>
                    <p className="text-center">Login to stay connected.</p>
                    <Form onSubmit={handleLogin}>
                      <Row>
                        <Col lg="12">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="email" className="">
                              Email
                            </Form.Label>
                            <TextInput
                              withAsterisk
                              type="email"
                              className=""
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              aria-describedby="email"
                              placeholder=""
                            />
                          </Form.Group>
                        </Col>
                        <Col lg="12" className="">
                          <Form.Group className="form-group">
                            <Form.Label htmlFor="password" className="">
                              Password
                            </Form.Label>
                            {/* <Form.Control
                              type="password"
                              className=""
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              aria-describedby="password"
                              placeholder=" "
                            /> */}
                            <Popover
                              opened={popoverOpened}
                              position="bottom"
                              width="target"
                              transitionProps={{ transition: "pop" }}
                            >
                              <Popover.Target>
                                <div
                                  onFocusCapture={() => setPopoverOpened(true)}
                                  onBlurCapture={() => setPopoverOpened(false)}
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
                                  color={color}
                                  value={strength}
                                  size={5}
                                  mb="xs"
                                />
                                <PasswordRequirement
                                  label="Includes at least 8 characters"
                                  meets={password.length > 7}
                                />
                                {checks}
                              </Popover.Dropdown>
                            </Popover>
                          </Form.Group>
                        </Col>
                        <Col lg="12" className="d-flex justify-content-between">
                          {/* <Form.Check className="form-check mb-3">
                            <Form.Check.Input
                              type="checkbox"
                              id="customCheck1"
                            />
                            <Form.Check.Label htmlFor="customCheck1">
                              Remember Me
                            </Form.Check.Label>
                          </Form.Check> */}
                          <Link to="/pwreset">Forgot Password?</Link>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-center">
                        <Button
                          // onClick={() => history("/dashboard")}

                          type="submit"
                          variant="btn btn-primary"
                        >
                          Sign In
                        </Button>
                      </div>
                      {/* <p className="text-center my-3">
                        or sign in with other accounts?
                      </p>
                      <div className="d-flex justify-content-center">
                        <ListGroup
                          as="ul"
                          className="list-group-horizontal list-group-flush"
                        >
                          <ListGroup.Item as="li" className="border-0 pb-0">
                            <Link to="#">
                              <Image src={facebook} alt="fb" />
                            </Link>
                          </ListGroup.Item>
                          <ListGroup.Item as="li" className="border-0 pb-0">
                            <Link to="#">
                              <Image src={google} alt="gm" />
                            </Link>
                          </ListGroup.Item>
                          <ListGroup.Item as="li" className="border-0 pb-0">
                            <Link to="#">
                              <Image src={instagram} alt="im" />
                            </Link>
                          </ListGroup.Item>
                          <ListGroup.Item as="li" className="border-0 pb-0">
                            <Link to="#">
                              <Image src={linkedin} alt="li" />
                            </Link>
                          </ListGroup.Item>
                        </ListGroup>
                      </div> */}
                      {/* <p className="mt-3 text-center">
                        Don’t have an account?{" "}
                        <Link to="/auth/sign-up" className="text-underline">
                          Click here to sign up.
                        </Link>
                      </p> */}
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <div className="sign-bg">
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
          <Col
            md="6"
            className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden"
          >
            <Image
              src={auth1}
              className="Image-fluid gradient-main animated-scaleX"
              alt="images"
            />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Login;
