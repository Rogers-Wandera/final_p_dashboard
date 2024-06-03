import { useState } from "react";
import { Card, Col, Nav } from "react-bootstrap";
import { Group } from "@mantine/core";
import SpatialTrackingIcon from "@mui/icons-material/SpatialTracking";
import { IconSwitchHorizontal, IconDeviceAudioTape } from "@tabler/icons-react";
import "../imageclassifier/navbar.simple.css";

const data = [
  {
    link: "audio-recognition",
    label: "Audio Recognition",
    Icon: <IconDeviceAudioTape className="linkIcon-xc" />,
  },
  {
    link: "liveaudio-recognition",
    label: "Live Recognition",
    Icon: <SpatialTrackingIcon className="linkIcon-xc" />,
  },
];

type leftsideprops = {
  setEventKey: React.Dispatch<React.SetStateAction<string>>;
  eventKey: string;
};
const AudioClassifierLeftSide = ({ setEventKey, eventKey }: leftsideprops) => {
  const [active, setActive] = useState("Image Recognition");

  const links = data.map((item) => (
    <Nav.Item
      className="link-xc"
      data-active={item.label === active || undefined}
      key={item.label}
      onClick={() => {
        setActive(item.label);
        setEventKey(item.link);
      }}
    >
      <Nav.Link eventKey={item.link}>
        {item.Icon}
        <span>{item.label}</span>
      </Nav.Link>
    </Nav.Item>
  ));
  return (
    <Col lg="4" className="col-g-4">
      <Card>
        <Nav
          className="navbar-xc"
          id="recognition-nav-tabs"
          role="tablist"
          defaultActiveKey={eventKey}
        >
          <div className="navbarMain-xc">
            <Group className="header-xc">Select Classification Type</Group>
            <hr />
            {links}
          </div>

          <hr />
          <div className="footer-xc">
            <a
              href="#"
              className="link-xc"
              onClick={(event) => event.preventDefault()}
            >
              <IconSwitchHorizontal className="linkIcon" stroke={1.5} />
              <span>Top Recognitions</span>
            </a>
          </div>
        </Nav>
      </Card>
    </Col>
  );
};

export default AudioClassifierLeftSide;
