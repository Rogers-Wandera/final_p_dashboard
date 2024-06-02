import { IconButton } from "@mui/material";
import { Card, Col, Image, Nav } from "react-bootstrap";
import avatars11 from "../../../../../assets/images/avatars/01.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mantine/core";
import { persontype } from "../person";

export type MP_headerprops = {
  person: persontype;
};
const ManagePersonHeader = ({ person }: MP_headerprops) => {
  const navigate = useNavigate();
  return (
    <Col lg="12">
      <Card>
        <Card.Body>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-wrap align-items-center">
              <div className="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                <Image
                  className="theme-color-default-img img-fluid rounded-pill avatar-100"
                  src={avatars11}
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
                <h4 className="me-2 h4">{person.fullName}</h4>
                <span> - {person.gender}</span>
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
                <Nav.Link eventKey="first">Meta</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="second">Images</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="third">Audios</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ManagePersonHeader;
