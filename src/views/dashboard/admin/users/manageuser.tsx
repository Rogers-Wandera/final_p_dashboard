import { useEffect, useState } from "react";
import FsLightbox from "fslightbox-react";

import { Row, Col, Tab } from "react-bootstrap";
// img

import icon1 from "../../../../assets/images/icons/01.png";
import icon2 from "../../../../assets/images/icons/02.png";
import icon4 from "../../../../assets/images/icons/04.png";
import icon8 from "../../../../assets/images/icons/08.png";

import icon5 from "../../../../assets/images/icons/05.png";
import shap2 from "../../../../assets/images/shapes/02.png";
import shap4 from "../../../../assets/images/shapes/04.png";
import shap6 from "../../../../assets/images/shapes/06.png";
import withAuthentication, {
  WithUserAuthProps,
} from "../../../../hoc/withUserAuth";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRouter, { PropsRouterType } from "../../../../hoc/withRouter";
import withRolesVerify from "../../../../hoc/withRolesVerify";
import { decryptUrl } from "../../../../helpers/utils";
import { user } from "./users";
import { Box, Loader, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import UserSideLeft from "./configs/manageuser/usersideleft";
import UserSideRight from "./configs/manageuser/usersideright";
import UserHeader from "./configs/manageuser/userheader";
import {
  HandleGetUser,
  HandleGetUserRoles,
} from "./configs/manageuser/userdataapi";

export type manageuserprops = {
  acceptedroles: number[];
};

export type userrolestype = {
  id: number;
  rolename: string;
  role: number;
  isActive: number;
  description: string;
};
const ManageUser = ({
  router,
  auth,
}: manageuserprops & PropsRouterType & WithUserAuthProps) => {
  const [toggler, setToggler] = useState<boolean>(false);
  const [userdata, setUserData] = useState<user>({} as user);
  const [manual, setManual] = useState(false);
  const [userroles, setUserRoles] = useState<userrolestype[]>([]);
  const [visible, { open, close }] = useDisclosure(false);
  const { params } = router;
  const { id } = params;
  const decrypted = decryptUrl(id as string);
  const HandleGetUserData = async () => {
    try {
      open();
      const user_data = await HandleGetUser(decrypted, auth.token);
      const user_roles = await HandleGetUserRoles(decrypted, auth.token);
      setUserData(user_data);
      setUserRoles(user_roles);
      close();
    } catch (error) {
      close();
    }
  };

  useEffect(() => {
    HandleGetUserData();
  }, [manual]);
  return (
    <Box>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        loaderProps={{ children: <Loader color="blue" type="bars" /> }}
      />
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
          <UserHeader userdata={userdata} />
          <UserSideLeft
            user={userdata}
            setToggler={setToggler}
            toggler={toggler}
            userroles={userroles}
            viewer="Admin"
            setManual={setManual}
            manual={manual}
          />
          {/* content */}
          <Col lg="6"></Col>
          {/* end content */}
          <UserSideRight
            user={userdata}
            setToggler={setToggler}
            toggler={toggler}
          />
        </Row>
      </Tab.Container>
    </Box>
  );
};
const ManageWithVerified = withAuthentication(
  withRouter(withRouteRole(ManageUser))
);
const ManageWithAcceptedRoles = withRolesVerify(ManageWithVerified);

export default ManageWithAcceptedRoles;
