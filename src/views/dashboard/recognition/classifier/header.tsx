import { Tooltip } from "@mantine/core";
import { IconButton } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Card, Col, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export type headertrainerprops = {
  setType: React.Dispatch<React.SetStateAction<"Image" | "Audio">>;
  setEventKey: React.Dispatch<React.SetStateAction<string>>;
};
function HeaderClassifier({ setType, setEventKey }: headertrainerprops) {
  const navigate = useNavigate();
  return (
    <div>
      <Col lg="12">
        <Card>
          <Card.Body>
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div className="d-flex flex-wrap align-items-center">
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
                <div className="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                  {/* <h4 className="me-2 h4">Before Training</h4>
                  <span> - Please be vigillant</span> */}
                </div>
              </div>
              <Nav
                as="ul"
                className="d-flex nav-pills mb-0 text-center profile-tab"
                data-toggle="slider-tab"
                id="profile-pills-tab"
                role="tablist"
              >
                <Nav.Item
                  as="li"
                  onClick={() => {
                    setType("Image");
                    setEventKey("first");
                  }}
                >
                  <Nav.Link eventKey="first">Image Classifier</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  as="li"
                  onClick={() => {
                    setType("Audio");
                    setEventKey("second");
                  }}
                >
                  <Nav.Link eventKey="second">Audio Classifier</Nav.Link>
                </Nav.Item>
                {/* <Nav.Item as="li">
                  <Nav.Link eventKey="third">Audios</Nav.Link>
                </Nav.Item> */}
              </Nav>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
}

export default HeaderClassifier;
