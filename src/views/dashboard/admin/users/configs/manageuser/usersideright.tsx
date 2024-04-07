import { Card, Col, Image } from "react-bootstrap";
import { user } from "../../users";
import { Link } from "react-router-dom";

// icons

import icon1 from "../../../../../../assets/images/icons/01.png";
import icon2 from "../../../../../../assets/images/icons/02.png";
import icon3 from "../../../../../../assets/images/icons/03.png";
import icon4 from "../../../../../../assets/images/icons/04.png";
import icon8 from "../../../../../../assets/images/icons/08.png";
import icon7 from "../../../../../../assets/images/icons/07.png";
import icon6 from "../../../../../../assets/images/icons/06.png";

import icon5 from "../../../../../../assets/images/icons/05.png";

type userpageprops = {
  user: user;
  toggler: boolean;
  setToggler: React.Dispatch<React.SetStateAction<boolean>>;
};
const UserSideRight = ({ user, toggler, setToggler }: userpageprops) => {
  return (
    <Col lg="3">
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">About</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <p>Lorem ipsum dolor sit amet, contur adipiscing elit.</p>
          <div className="mb-1">
            Email:{" "}
            <Link to="#" className="ms-3">
              nikjone@demoo.com
            </Link>
          </div>
          <div className="mb-1">
            Phone:{" "}
            <Link to="#" className="ms-3">
              001 2351 256 12
            </Link>
          </div>
          <div>
            Location: <span className="ms-3">USA</span>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">Stories</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <ul className="list-inline m-0 p-0">
            <li className="d-flex mb-4 align-items-center active">
              <Image
                src={icon6}
                alt="story-img"
                className="rounded-pill avatar-70 p-1 border bg-soft-light img-fluid"
              />
              <div className="ms-3">
                <h5>Web Design</h5>
                <p className="mb-0">1 hour ago</p>
              </div>
            </li>
            <li className="d-flex mb-4 align-items-center">
              <Image
                src={icon3}
                alt="story-img"
                className="rounded-pill avatar-70 p-1 border img-fluid bg-soft-danger"
              />
              <div className="ms-3">
                <h5>App Design</h5>
                <p className="mb-0">4 hour ago</p>
              </div>
            </li>
            <li className="d-flex align-items-center">
              <Image
                src={icon7}
                alt="story-img"
                className="rounded-pill avatar-70 p-1 border bg-soft-primary img-fluid"
              />
              <div className="ms-3">
                <h5>Abstract Design</h5>
                <p className="mb-0">9 hour ago</p>
              </div>
            </li>
          </ul>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">Suggestions</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <ul className="list-inline m-0 p-0">
            <li className="d-flex mb-4 align-items-center">
              <div className="img-fluid bg-soft-warning rounded-pill">
                <Image
                  src={icon5}
                  alt="story-img"
                  className="rounded-pill avatar-40"
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6>Paul Molive</h6>
                <p className="mb-0">4 mutual friends</p>
              </div>
              <Link
                to="#"
                className="btn btn-outline-primary rounded-circle btn-icon btn-sm p-2"
              >
                <span className="btn-inner">
                  <svg
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#3a57e8"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19.2036 8.66919V12.6792"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M21.2497 10.6741H17.1597"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
            <li className="d-flex mb-4 align-items-center">
              <div className="img-fluid bg-soft-danger rounded-pill">
                <Image
                  src={icon3}
                  alt="story-img"
                  className="rounded-pill avatar-40"
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6>Robert Fox</h6>
                <p className="mb-0">4 mutual friends</p>
              </div>
              <Link
                to="#"
                className="btn btn-outline-primary rounded-circle btn-icon btn-sm p-2"
              >
                <span className="btn-inner">
                  <svg
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#3a57e8"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19.2036 8.66919V12.6792"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M21.2497 10.6741H17.1597"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
            <li className="d-flex mb-4 align-items-center">
              <div className="img-fluid bg-soft-dark rounded-pill">
                <Image
                  src={icon6}
                  alt="story-img"
                  className="rounded-pill avatar-40"
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6>Jenny Wilson</h6>
                <p className="mb-0">6 mutual friends</p>
              </div>
              <Link
                to="#"
                className="btn btn-outline-primary rounded-circle btn-icon btn-sm p-2"
              >
                <span className="btn-inner">
                  <svg
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    colorProfile="#3a57e8"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19.2036 8.66919V12.6792"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M21.2497 10.6741H17.1597"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
            <li className="d-flex mb-4 align-items-center">
              <div className="img-fluid bg-soft-primary rounded-pill">
                <Image
                  src={icon7}
                  alt="story-img"
                  className="rounded-pill avatar-40"
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6>Cody Fisher</h6>
                <p className="mb-0">8 mutual friends</p>
              </div>
              <Link
                to="#"
                className="btn btn-outline-primary rounded-circle btn-icon btn-sm p-2"
              >
                <span className="btn-inner">
                  <svg
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#3a57e8"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19.2036 8.66919V12.6792"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M21.2497 10.6741H17.1597"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
            <li className="d-flex mb-4 align-items-center">
              <div className="img-fluid bg-soft-info rounded-pill">
                <Image
                  src={icon4}
                  alt="story-img"
                  className="rounded-pill avatar-40"
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6>Bessie Cooper</h6>
                <p className="mb-0">1 mutual friends</p>
              </div>
              <Link
                to="#"
                className="btn btn-outline-primary rounded-circle btn-icon btn-sm p-2"
              >
                <span className="btn-inner">
                  <svg
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#3a57e8"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19.2036 8.66919V12.6792"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M21.2497 10.6741H17.1597"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
            <li className="d-flex mb-4 align-items-center">
              <div className="img-fluid bg-soft-warning rounded-pill">
                <Image
                  src={icon2}
                  alt="story-img"
                  className="rounded-pill avatar-40"
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6>Wade Warren</h6>
                <p className="mb-0">3 mutual friends</p>
              </div>
              <Link
                to="#"
                className="btn btn-outline-primary rounded-circle btn-icon btn-sm p-2"
              >
                <span className="btn-inner">
                  <svg
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#3a57e8"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19.2036 8.66919V12.6792"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M21.2497 10.6741H17.1597"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
            <li className="d-flex mb-4 align-items-center">
              <div className="img-fluid bg-soft-success rounded-pill">
                <Image
                  src={icon1}
                  alt="story-img"
                  className="rounded-pill avatar-40"
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6>Guy Hawkins</h6>
                <p className="mb-0">12 mutual friends</p>
              </div>
              <Link
                to="#"
                className="btn btn-outline-primary rounded-circle btn-icon btn-sm p-2"
              >
                <span className="btn-inner">
                  <svg
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#3a57e8"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19.2036 8.66919V12.6792"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M21.2497 10.6741H17.1597"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <div className="img-fluid bg-soft-info rounded-pill">
                <Image
                  src={icon8}
                  alt="story-img"
                  className="rounded-pill avatar-40"
                />
              </div>
              <div className="ms-3 flex-grow-1">
                <h6>Floyd Miles</h6>
                <p className="mb-0">2 mutual friends</p>
              </div>
              <Link
                to="#"
                className="btn btn-outline-primary rounded-circle btn-icon btn-sm p-2"
              >
                <span className="btn-inner">
                  <svg
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#3a57e8"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19.2036 8.66919V12.6792"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M21.2497 10.6741H17.1597"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UserSideRight;
