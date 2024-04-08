import { FormEvent, useEffect, useState } from "react";
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
  userauthprops,
} from "../../../../hoc/withUserAuth";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRouter, { RouterContextType } from "../../../../hoc/withRouter";
import withRolesVerify from "../../../../hoc/withRolesVerify";
import { decryptUrl, handleError } from "../../../../helpers/utils";
import { user } from "./users";
import { Box, Loader, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import UserSideLeft from "./configs/manageuser/usersideleft";
import UserSideRight from "./configs/manageuser/usersideright";
import UserHeader from "./configs/manageuser/userheader";
import {
  HandleGetUnAssignedRoles,
  HandleGetUser,
  HandleGetUserRoles,
} from "./configs/manageuser/userdataapi";
import FormModal, {
  formcomponentsprops,
  selectdataprops,
} from "../../../../components/modals/formmodal/formmodal";
import { rolesresponse } from "../../../configurations/roles/roles";
import Joi from "joi";
import { UseFormReturnType } from "@mantine/form";
import { usePostDataMutation } from "../../../../store/services/apislice";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../contexts/sharedcontexts";

const validation = Joi.object({
  roleId: Joi.number().required().messages({
    "any.required": "Role is required",
    "number.base": "Role must be a number",
  }),
});

export type manageuserprops = {
  acceptedroles: number[];
  router?: RouterContextType;
  auth?: userauthprops;
};

export type userrolestype = {
  id: number;
  rolename: string;
  role: number;
  isActive: number;
  description: string;
  roleId: number;
};
const ManageUser = ({ router, auth }: manageuserprops) => {
  const [toggler, setToggler] = useState<boolean>(false);
  const [userdata, setUserData] = useState<user>({} as user);
  const [manual, setManual] = useState(false);
  const [userroles, setUserRoles] = useState<userrolestype[]>([]);
  const [visible, { open, close }] = useDisclosure(false);
  const [opened, { open: openmodal, close: closemodal }] = useDisclosure(false);
  const [selectoptions, setSelectOptions] = useState<selectdataprops[]>([]);
  const [unassignedroles, setUnassignedroles] = useState<rolesresponse[]>([]);
  const params = router?.params;
  const id = params?.id;
  const decrypted = decryptUrl(id as string);
  const [postRole] = usePostDataMutation<userrolestype>({});
  const appState = useAppState();

  const HandleGetUserData = async () => {
    try {
      open();
      const user_data = await HandleGetUser(decrypted, auth?.token as string);
      const user_roles = await HandleGetUserRoles(
        decrypted,
        auth?.token as string
      );
      const unassigned = await HandleGetUnAssignedRoles(
        decrypted,
        auth?.token as string
      );
      setUserData(user_data);
      setUserRoles(user_roles);
      setUnassignedroles(unassigned);
      close();
    } catch (error) {
      close();
    }
  };

  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
    form: UseFormReturnType<
      Record<string, unknown>,
      (values: Record<string, unknown>) => Record<string, unknown>
    >
  ) => {
    event.preventDefault();
    try {
      const validation = form.validate();
      if (validation.hasErrors === false) {
        open();
        const values = form.values;
        const postdata = { ...values, userId: decrypted };
        const response = await postRole({
          url: "/admin/roles",
          data: postdata,
        });
        if ("error" in response) {
          throw response.error;
        }
        setManual(!manual);
        closemodal();
        form.reset();
        enqueueSnackbar(response.data.msg, {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
      }
      close();
    } catch (error) {
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };

  const forminputs: formcomponentsprops[] = [
    {
      name: "roleId",
      inputtype: "select",
      label: "Role",
      required: true,
      formgrid: { span: "auto" },
    },
  ];

  useEffect(() => {
    HandleGetUserData();
  }, [manual]);

  useEffect(() => {
    const selectdata: selectdataprops[] = [];
    if (unassignedroles.length > 0) {
      const data: { label: string; value: string }[] = [];
      unassignedroles.forEach((role) => {
        data.push({
          label: role.rolename,
          value: role.id.toString(),
        });
      });
      selectdata.push({
        name: "roleId",
        data: data,
        notfound: "No role found",
      });
      setSelectOptions(selectdata);
    }
  }, [unassignedroles]);
  return (
    <Box>
      <LoadingOverlay
        visible={visible}
        zIndex={1500}
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
        <FormModal
          opened={opened}
          close={closemodal}
          formname={"Add-Roles"}
          title="Add Role"
          elements={forminputs}
          size="lg"
          selectdata={selectoptions}
          // setResetForm={setResetform}
          // resetform={resetform}
          formvalidation={validation}
          buttonconfigs={{ handleSubmit: handleFormSubmit }}
          // globalconfigs={moremodalconfigs}
        />
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
            unassignedroles={unassignedroles}
            openmodal={openmodal}
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
