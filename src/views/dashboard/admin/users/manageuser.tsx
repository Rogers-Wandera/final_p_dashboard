import { Fragment, useState } from "react";
import FsLightbox from "fslightbox-react";

import { Row, Col, Image, Nav, Tab } from "react-bootstrap";
import Card from "../../../../components/Card";
// img

import avatars11 from "../../../../assets/images/avatars/01.png";
import avatars22 from "../../../../assets/images/avatars/avtar_1.png";
import avatars33 from "../../../../assets/images/avatars/avtar_2.png";
import avatars44 from "../../../../assets/images/avatars/avtar_3.png";
import avatars55 from "../../../../assets/images/avatars/avtar_4.png";
import avatars66 from "../../../../assets/images/avatars/avtar_5.png";

import icon1 from "../../../../assets/images/icons/01.png";
import icon2 from "../../../../assets/images/icons/02.png";
import icon4 from "../../../../assets/images/icons/04.png";
import icon8 from "../../../../assets/images/icons/08.png";

import icon5 from "../../../../assets/images/icons/05.png";
import shap2 from "../../../../assets/images/shapes/02.png";
import shap4 from "../../../../assets/images/shapes/04.png";
import shap6 from "../../../../assets/images/shapes/06.png";
import withAuthentication from "../../../../hoc/withUserAuth";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRouter, {
  PropsRouterType,
  RouterContextType,
} from "../../../../hoc/withRouter";
import withRolesVerify from "../../../../hoc/withRolesVerify";
import { useApiQuery } from "../../../../helpers/apiquery";
import { decryptUrl } from "../../../../helpers/utils";

export type manageuserprops = {
  acceptedroles: number[];
};
const ManageUser = ({ router }: manageuserprops & PropsRouterType) => {
  const [toggler, setToggler] = useState<boolean>(false);
  const { params, navigate } = router;
  const { id } = params;
  const decrypted = decryptUrl(id as string);
  return (
    <Fragment>
      <FsLightbox
        toggler={toggler}
        sources={[
          icon4,
          shap2,
          icon8,
          shap4,
          icon2,
          shap6,
          icon5,
          shap4,
          icon1,
        ]}
      />
      <Tab.Container defaultActiveKey="first">
        <Row>
          <Col lg="12">
            <Card>
              <Card.Body>
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex flex-wrap align-items-center">
                    <div className="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                      <Image
                        className="theme-color-default-img  img-fluid rounded-pill avatar-100"
                        src={avatars11}
                        alt="profile-pic"
                      />
                      <Image
                        className="theme-color-purple-img img-fluid rounded-pill avatar-100"
                        src={avatars22}
                        alt="profile-pic"
                      />
                      <Image
                        className="theme-color-blue-img img-fluid rounded-pill avatar-100"
                        src={avatars33}
                        alt="profile-pic"
                      />
                      <Image
                        className="theme-color-green-img img-fluid rounded-pill avatar-100"
                        src={avatars55}
                        alt="profile-pic"
                      />
                      <Image
                        className="theme-color-yellow-img img-fluid rounded-pill avatar-100"
                        src={avatars66}
                        alt="profile-pic"
                      />
                      <Image
                        className="theme-color-pink-img img-fluid rounded-pill avatar-100"
                        src={avatars44}
                        alt="profile-pic"
                      />
                    </div>
                    <div className="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                      <h4 className="me-2 h4">Austin Robertson</h4>
                      <span> - Web Developer</span>
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
                      <Nav.Link eventKey="first">Feed</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="second">Activity</Nav.Link>
                    </Nav.Item>
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
        </Row>
      </Tab.Container>
    </Fragment>
  );
};
const ManageWithVerified = withAuthentication(
  withRouter(withRouteRole(ManageUser))
);
const ManageWithAcceptedRoles = withRolesVerify(ManageWithVerified);

export default ManageWithAcceptedRoles;
