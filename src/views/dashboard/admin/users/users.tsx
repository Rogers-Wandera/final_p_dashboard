import { useEffect } from "react";
import withRouter, { RouterContextType } from "../../../../hoc/withRouter";
import withAuthentication from "../../../../hoc/withUserAuth";
import { useAppDispatch } from "../../../../hooks/hook";
import { setHeaderText } from "../../../../store/services/defaults";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FormModal, {
  formcomponentsprops,
} from "../../../../components/modals/formmodal";
import { withspecialchars } from "../../../../assets/defaults/passwordrequirements";

const forminputs: formcomponentsprops[] = [
  {
    inputtype: "text",
    label: "Name",
    name: "name",
    required: true,
    initialvalue: "",
    formgrid: { span: { base: 12, md: 6, lg: 6 } },
  },
  {
    inputtype: "number",
    label: "Age",
    name: "age",
    initialvalue: 0,
    required: true,
    formgrid: { span: { base: 12, md: 6, lg: 6 } },
    otherprops: { min: 20, max: 100 },
  },
  {
    inputtype: "password",
    label: "Enter Password",
    name: "password",
    initialvalue: "",
    required: true,
    formgrid: { span: { base: 12, md: 6, lg: 6 } },
    validator: { pwlength: 8, requirements: withspecialchars },
  },
  {
    inputtype: "datepicker",
    label: "Choose City",
    name: "Name",
    initialvalue: "",
    required: true,
    formgrid: { span: { base: 12, md: 6, lg: 6 } },
  },
];

const Users = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);
  //   const { params, navigate } = props.router as RouterContextType;
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHeaderText("Manage Users"));
  }, []);
  return (
    <div>
      <Button onClick={open}>Open</Button>
      <FormModal
        opened={opened}
        close={close}
        title="Add User"
        elements={forminputs}
      />
    </div>
  );
};

export default withAuthentication(withRouter(Users));
