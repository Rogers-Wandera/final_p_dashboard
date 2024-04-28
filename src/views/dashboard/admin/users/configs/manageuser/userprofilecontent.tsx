import { Card, Col, Image, Row, Tab } from "react-bootstrap";
import avatars11 from "../../../../../../assets/images/avatars/01.png";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@mantine/core";
import { enqueueSnackbar } from "notistack";
import { useAuthUser } from "../../../../../../contexts/authcontext";
import { user } from "../../users";
import { useEffect } from "react";

type userprofileprops = {
  userdata: user;
  viewer: string;
};
const UserProfileContent = ({ userdata, viewer }: userprofileprops) => {
  const { id } = useAuthUser();
  return (
    <Tab.Pane eventKey="first" id="profile-profile">
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">Profile</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="text-center">
            <div className="user-profile">
              <Image
                className="theme-color-default-img  rounded-pill avatar-130 img-fluid"
                src={
                  userdata.image !== null && userdata.image !== ""
                    ? userdata.image
                    : avatars11
                }
                alt={userdata.userName}
              />
            </div>
            <div className="mt-3">
              <h3 className="d-inline-block">{userdata.userName}</h3>
              <p className="d-inline-block pl-3"> - {userdata.position}</p>
              <p className="mb-0">
                {/* Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s */}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <div className="header-title">
            <Row>
              <Col lg={8}>
                <h4 className="card-title">
                  About {viewer === "Admin" && "User"}
                </h4>
              </Col>
              <Col lg={4}>
                {" "}
                {viewer === "User" ||
                  (userdata.id === id && (
                    <Button
                      type="button"
                      onClick={() =>
                        enqueueSnackbar("Feature coming soon", {
                          variant: "info",
                          anchorOrigin: {
                            horizontal: "right",
                            vertical: "top",
                          },
                        })
                      }
                    >
                      Update
                    </Button>
                  ))}
              </Col>
            </Row>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="user-bio">
            <p>
              {/* Tart I love sugar plum I love oat cake. Sweet roll caramels I love
              jujubes. Topping cake wafer. */}
            </p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Joined:</h6>
            <p>
              {userdata.createdAt !== null &&
                userdata.createdAt !== undefined &&
                format(new Date(userdata.createdAt), "dd MMM yyyy hh:mm a")}
            </p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Contact:</h6>
            <p>{userdata.tel}</p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Email:</h6>
            <p>
              <Link to="#" className="text-body">
                {" "}
                {userdata.email}
              </Link>
            </p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Position:</h6>
            <p> {userdata.position} </p>
          </div>
          <div className="mt-2">
            <h6 className="mb-1">Gender:</h6>
            <p>{userdata.gender}</p>
          </div>
        </Card.Body>
      </Card>
    </Tab.Pane>
  );
};

export default UserProfileContent;
