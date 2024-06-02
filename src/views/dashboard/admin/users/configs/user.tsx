import {
  TableColumns,
  additionaltopbaractions,
  tableCols,
} from "../../../../../components/tables/serverside";
import { user } from "../users";
import defaultavatar from "../../../../../assets/images/avatars/avtar_1.png";
import femaledefault from "../../../../../assets/images/avatars/avtar_5.png";
import { Avatar, Switch } from "@mantine/core";
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
import { setViewer } from "../../../../../store/services/defaults";

export type userformtype = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmpassword: string;
  gender: string;
  position: string;
  tel: string;
};
export const userconfigs = (
  navigate: NavigateFunction,
  setManual: React.Dispatch<React.SetStateAction<boolean>>,
  setRowSelection: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>
) => {
  const dispatch = useAppDispatch();
  const appstate = useAppState();
  const { id: userId } = useAuthUser();
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
      accessorKey: "online",
      header: "Online",
      Edit: () => null,
      Cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return (
          <>
            <Switch
              size="lg"
              onLabel="Online"
              color="green"
              checked={value === 1}
              offLabel="Offline"
            />
          </>
        );
      },
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
    { name: "online", type: "text" },
  ];

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
        setRowSelection({});
        dispatch(setViewer("Admin"));
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
    otherconfigs,
    tablecolumns,
    toptoolbaractions,
  };
};
