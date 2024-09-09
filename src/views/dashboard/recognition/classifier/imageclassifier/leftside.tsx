import { useState } from "react";
import { Card, Col, Nav } from "react-bootstrap";
import { Group } from "@mantine/core";
import { IconImageInPicture, IconVideo } from "@tabler/icons-react";
import "./navbar.simple.css";
import { Person } from "../../../../../app/types";
import LiveRecognitionData from "./liverecognition/livedata";

const data = [
  {
    link: "image-recognition",
    label: "Image Recognition",
    icon: IconImageInPicture,
  },
  { link: "live-recognition", label: "Live Recognition", icon: IconVideo },
];

type leftsideprops = {
  setEventKey: React.Dispatch<React.SetStateAction<string>>;
  eventKey: string;
  setSelectedDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
  setShowCapture: React.Dispatch<React.SetStateAction<boolean>>;
  livedata: Partial<Person>;
  show: boolean;
};
const ImageClassifierLeftSide = ({
  setEventKey,
  eventKey,
  setSelectedDeviceId,
  setShowCapture,
  livedata,
  show,
}: leftsideprops) => {
  const [active, setActive] = useState("image-recognition");

  const links = data.map((item) => (
    <Nav.Item
      className="link-xc"
      data-active={item.label === active || undefined}
      key={item.label}
      onClick={() => {
        setActive(item.label);
        setEventKey(item.link);
        setSelectedDeviceId(null);
        setShowCapture(false);
      }}
    >
      <Nav.Link eventKey={item.link}>
        <item.icon className="linkIcon-xc" stroke={1.5} />
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
          <LiveRecognitionData show={show} data={livedata} />
          <hr />
        </Nav>
      </Card>
    </Col>
  );
};

export default ImageClassifierLeftSide;
