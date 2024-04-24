import { Card, Col, Image, Nav } from "react-bootstrap";
import { user } from "../../users";
import avatars11 from "../../../../../../assets/images/avatars/01.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export type headeruserprops = {
  userdata: user;
  viewer: "Admin" | "User";
};

function UserHeader({ userdata, viewer }: headeruserprops) {
  const navigate = useNavigate();
  return (
    <Col lg="12">
      <Card>
        <Card.Body>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-wrap align-items-center">
              <div className="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                <Image
                  className="theme-color-default-img  img-fluid rounded-pill avatar-100"
                  src={
                    userdata.image !== null && userdata.image !== ""
                      ? userdata.image
                      : avatars11
                  }
                  alt={userdata.userName}
                />
                <div>
                  <Tooltip label="Back">
                    <IconButton aria-label="back" onClick={() => navigate(-1)}>
                      <KeyboardBackspaceIcon
                        fontSize="inherit"
                        color="secondary"
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                <h4 className="me-2 h4">{userdata.userName}</h4>
                <span> - {userdata.position}</span>
              </div>
            </div>
            <Nav
              as="ul"
              className="d-flex nav-pills mb-0 text-center profile-tab"
              data-toggle="slider-tab"
              id="profile-pills-tab"
              role="tablist"
            >
              <Nav.Item as="li">
                <Nav.Link eventKey="first">Profile</Nav.Link>
              </Nav.Item>
              {viewer === "Admin" && (
                <Nav.Item as="li">
                  <Nav.Link eventKey="second">Assign Roles</Nav.Link>
                </Nav.Item>
              )}
              <Nav.Item as="li">
                <Nav.Link eventKey="third">Friends</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="fourth">Profile</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default UserHeader;
