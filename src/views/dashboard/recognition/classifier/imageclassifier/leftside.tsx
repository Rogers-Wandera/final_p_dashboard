import { useState } from "react";
import { Card, Col } from "react-bootstrap";
import { Group } from "@mantine/core";
import {
  IconSwitchHorizontal,
  IconLogout,
  IconImageInPicture,
  IconVideo,
} from "@tabler/icons-react";
import "./navbar.simple.css";

const data = [
  { link: "", label: "Image Recognition", icon: IconImageInPicture },
  { link: "", label: "Live Recognition", icon: IconVideo },
];

const ImageClassifierLeftSide = () => {
  const [active, setActive] = useState("Image Recognition");

  const links = data.map((item) => (
    <a
      className="link-xc"
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className="linkIcon-xc" stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));
  return (
    <Col lg="4" className="col-g-4">
      <Card>
        <nav className="navbar-xc">
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
        </nav>
      </Card>
    </Col>
  );
};

export default ImageClassifierLeftSide;
