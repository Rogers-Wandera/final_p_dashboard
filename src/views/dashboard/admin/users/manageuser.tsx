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
// import withRolesVerify from "../../../../hoc/withRolesVerify";
import { decryptUrl, handleError } from "../../../../helpers/utils";
import { user } from "./users";
import { Box, Loader, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import UserSideLeft from "./configs/manageuser/usersideleft";
import UserSideRight from "./configs/manageuser/usersideright";
import UserHeader from "./configs/manageuser/userheader";
import {
  HandleGetModules,
  HandleGetUnAssignedRoles,
  HandleGetUser,
  HandleGetUserRoles,
  HandleGetLinkRoles,
  selectoptionstype,
} from "./configs/manageuser/userdataapi";
import FormModal, {
  formcomponentsprops,
  selectdataprops,
} from "../../../../components/modals/formmodal/formmodal";
import { rolesresponse } from "../../../configurations/roles/roles";
import Joi from "joi";
import { UseFormReturnType, joiResolver, useForm } from "@mantine/form";
import { usePostDataMutation } from "../../../../store/services/apislice";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../contexts/sharedcontexts";
import ContentPage from "./configs/manageuser/content";
import { ModuleLinksProps } from "../modules/modulelinks";
import AddRoles from "./configs/manageuser/addroles";
import { useSelector } from "react-redux";
import { RootState } from "../../../../contexts/authcontext";

const validation = Joi.object({
  roleId: Joi.number().required().messages({
    "any.required": "Role is required",
    "number.base": "Role must be a number",
  }),
});

export type manageuserprops = {
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

export type userfromroletype = {
  roleId: number;
};
const ManageUser = ({ router, auth }: manageuserprops) => {
  const form = useForm<userfromroletype>({
    name: "Add-Roles",
    validate: joiResolver(validation),
  });
  const viewer = useSelector(
    (state: RootState) => state.appState.defaultstate.viewer
  );
  const [toggler, setToggler] = useState<boolean>(false);
  const [userdata, setUserData] = useState<user>({} as user);
  const [manual, setManual] = useState(false);
  const [userroles, setUserRoles] = useState<userrolestype[]>([]);
  const [visible, { open, close }] = useDisclosure(false);
  const [opened, { open: openmodal, close: closemodal }] = useDisclosure(false);
  const [modal, { open: modal_open, close: close_modal }] =
    useDisclosure(false);
  const [loader, { open: loaderopen, close: loaderclose }] =
    useDisclosure(false);
  const [selectoptions, setSelectOptions] = useState<selectdataprops[]>([]);
  const [unassignedroles, setUnassignedroles] = useState<rolesresponse[]>([]);
  const [modules, setModules] = useState<selectoptionstype[]>([]);
  const [linkroles, setLinkRoles] = useState<ModuleLinksProps[]>([]);
  const params = router?.params;
  const id = params?.id;
  const decrypted = decryptUrl(id as string);
  const [postRole] = usePostDataMutation({});
  const appState = useAppState();

  const HandleGetUserData = async () => {
    try {
      open();
      const user_data = await HandleGetUser(decrypted, auth?.token as string);
      const user_roles = await HandleGetUserRoles(
        decrypted,
        auth?.token as string
      );
      if (viewer === "Admin") {
        const unassigned = await HandleGetUnAssignedRoles(
          decrypted,
          auth?.token as string
        );
        const modules_links = await HandleGetModules(auth?.token as string);
        const user_roles_links = await HandleGetLinkRoles(
          decrypted,
          auth?.token as string
        );
        setUnassignedroles(unassigned);
        setModules(modules_links);
        setLinkRoles(user_roles_links);
      }
      setUserData(user_data);
      setUserRoles(user_roles);
      close();
    } catch (error) {
      close();
    }
  };

  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
    form: UseFormReturnType<
      userfromroletype,
      (values: userfromroletype) => userfromroletype
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
  }, [manual, viewer]);

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

  if (visible) {
    return (
      <LoadingOverlay
        visible={visible}
        zIndex={1500}
        loaderProps={{ children: <Loader color="blue" type="bars" /> }}
      />
    );
  }
  return (
    <Box>
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
        <AddRoles
          open={modal}
          close={close_modal}
          modules={modules}
          modulelinks={linkroles}
          userId={decrypted}
          openprogress={open}
          closeprogress={close}
        />
        <FormModal<userfromroletype>
          opened={opened}
          close={closemodal}
          title="Add Role"
          elements={forminputs}
          size="lg"
          selectdata={selectoptions}
          forminstance={form}
          buttonconfigs={{ handleSubmit: handleFormSubmit }}
        />
        <Row>
          <UserHeader
            userdata={userdata}
            viewer={viewer}
            setManual={setManual}
            manual={manual}
          />
          <UserSideLeft
            user={userdata}
            setToggler={setToggler}
            toggler={toggler}
            userroles={userroles}
            viewer={viewer}
            setManual={setManual}
            manual={manual}
            unassignedroles={unassignedroles}
            openmodal={openmodal}
          />
          {/* content */}
          <Col lg="6">
            <ContentPage
              userdata={userdata}
              viewer={viewer}
              userId={decrypted}
              modal_opened={modal_open}
              moduleslinks={linkroles}
              userroles={userroles}
              open={loaderopen}
              close={loaderclose}
              loader={loader}
            />
          </Col>
          {/* end content */}
          <UserSideRight
            user={userdata}
            setToggler={setToggler}
            toggler={toggler}
            viewer={viewer}
          />
        </Row>
      </Tab.Container>
    </Box>
  );
};
const ManageWithVerified = withAuthentication(
  withRouter(withRouteRole(ManageUser))
);
// const ManageWithAcceptedRoles = withRolesVerify(ManageWithVerified);

export default ManageWithVerified;
