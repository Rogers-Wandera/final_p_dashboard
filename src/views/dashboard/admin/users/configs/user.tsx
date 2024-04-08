import {
  formcomponentsprops,
  globalconfigs,
  selectdataprops,
} from "../../../../../components/modals/formmodal/formmodal";
import {
  TableColumns,
  additionaltopbaractions,
  tableCols,
} from "../../../../../components/tables/serverside";
import { user } from "../users";
import defaultavatar from "../../../../../assets/images/avatars/avtar_1.png";
import femaledefault from "../../../../../assets/images/avatars/avtar_5.png";
import { Avatar } from "@mantine/core";
import { withoutuppercase } from "../../../../../assets/defaults/passwordrequirements";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteIcon from "@mui/icons-material/Delete";
import { encryptUrl } from "../../../../../helpers/utils";
import { NavigateFunction } from "react-router-dom";
import { handleDelete } from "../../../../../store/services/apislice";
import { useAppDispatch } from "../../../../../hooks/hook";
import { useAppState } from "../../../../../contexts/sharedcontexts";
import { enqueueSnackbar } from "notistack";
import { MRT_RowSelectionState } from "material-react-table";
import { useAuthUser } from "../../../../../contexts/authcontext";

export const userconfigs = (
  navigate: NavigateFunction,
  setManual: React.Dispatch<React.SetStateAction<boolean>>,
  setRowSelection: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>
) => {
  const dispatch = useAppDispatch();
  const appstate = useAppState();
  const { id: userId } = useAuthUser();
  const forminputs: formcomponentsprops[] = [
    {
      inputtype: "text",
      label: "First Name",
      name: "firstname",
      required: true,
      initialvalue: "",
    },
    {
      inputtype: "text",
      label: "Last Name",
      name: "lastname",
      required: true,
      initialvalue: "",
    },
    {
      inputtype: "text",
      label: "Email",
      name: "email",
      initialvalue: "",
      required: true,
    },
    {
      inputtype: "password",
      label: "Password",
      name: "password",
      initialvalue: "",
      required: true,
    },
    {
      inputtype: "password",
      label: "Confirm Password",
      name: "confirmpassword",
      initialvalue: "",
      required: true,
    },
    {
      inputtype: "select",
      label: "Choose Gender",
      name: "gender",
      initialvalue: "",
      required: true,
    },
    {
      inputtype: "select",
      label: "Position",
      name: "position",
      initialvalue: "",
      required: true,
    },
    {
      inputtype: "text",
      label: "Tel",
      name: "tel",
      initialvalue: "",
      required: true,
    },
  ];
  const otherconfigs: tableCols<user>[] = [
    {
      accessorKey: "id",
      Edit: () => null,
    },
    {
      accessorKey: "image",
      header: "Profile",
      Edit: () => null,
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ cell, row }) => {
        const value = cell.getValue<string | null>();
        const avatartoshow =
          row.original.gender === "Male" ? defaultavatar : femaledefault;
        const name = row.original.userName;
        if (value === null) {
          return (
            <Avatar src={avatartoshow} alt={name} size="lg" variant="filled" />
          );
        } else if (value === "") {
          return (
            <Avatar src={avatartoshow} alt={name} size="lg" variant="filled" />
          );
        }
        return <Avatar src={value} alt={name} size="lg" variant="filled" />;
      },
    },
    {
      accessorKey: "userName",
      header: "Name",
      Edit: () => null,
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "tel",
      header: "Tel",
    },
  ];
  const tablecolumns: TableColumns[] = [
    { name: "id", type: "text" },
    { name: "image", type: "text" },
    { name: "userName", type: "text" },
    { name: "gender", type: "text" },
    { name: "position", type: "text" },
    { name: "tel", type: "text" },
  ];
  const selectdata: selectdataprops = {
    name: "gender",
    data: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
    ],
  };

  const moremodalconfigs: globalconfigs = {
    paswordvalidator: {
      pwlength: 8,
      check: true,
      requirements: withoutuppercase,
      morechecks: (form) => {
        const checks = {
          name: "confirmpassword",
          label: "Matches Password",
          checks:
            form.getInputProps("password").value ===
            form.getInputProps("confirmpassword").value,
        };
        return [checks];
      },
    },
  };

  const toptoolbaractions: additionaltopbaractions<user>[] = [
    {
      label: "Manage User",
      icon: <ManageAccountsIcon color="primary" />,
      onClick: (_, row) => {
        const id = encryptUrl(row.original.id.toString());
        if (row.original.verified !== 1) {
          enqueueSnackbar("User must be verified first", {
            variant: "info",
            anchorOrigin: { horizontal: "right", vertical: "top" },
          });
          return null;
        }
        navigate(`/dashboard/users/manage/${id}`);
      },
      show: "icon",
    },
    {
      label: "Delete User",
      icon: <DeleteIcon color="error" />,
      onClick: async (_, row) => {
        const id = row.original.id;
        if (id === userId) {
          enqueueSnackbar("You can not delete your self", {
            variant: "info",
            anchorOrigin: { horizontal: "right", vertical: "top" },
          });
          return null;
        }
        setRowSelection({});
        await handleDelete({
          url: "/user/users/" + id,
          dispatch,
          appstate,
          enqueueSnackbar: enqueueSnackbar,
          title: "Are you sure ?",
          text: "You want to delete this user",
          setManual,
        });
      },
      show: "icon",
    },
  ];
  return {
    forminputs,
    otherconfigs,
    tablecolumns,
    selectdata,
    moremodalconfigs,
    toptoolbaractions,
  };
};
