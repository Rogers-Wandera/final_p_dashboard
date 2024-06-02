import { decryptUrl } from "../../../../helpers/utils";
import withAuthentication from "../../../../hoc/withUserAuth";
import { useEffect, useState } from "react";
import withRouter, { RouterContextType } from "../../../../hoc/withRouter";
import { useAppDispatch } from "../../../../hooks/hook";
import { setHeaderText, setManual } from "../../../../store/services/defaults";
import { MRT_TableInstance, MRT_VisibilityState } from "material-react-table";
import {
  ColumnVisibility,
  ServerSideTable,
  addeditprops,
  menuitemsProps,
  tableCols,
} from "../../../../components/tables/serverside";
import { useApiQuery } from "../../../../helpers/apiquery";
import { useAuthUser } from "../../../../contexts/authcontext";
import { useTableContext } from "../../../../contexts/tablecontext";
import { format } from "date-fns";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRolesVerify from "../../../../hoc/withRolesVerify";
import { useDisclosure } from "@mantine/hooks";
import ModulePermissions from "./modulepermissions";
import LockPersonIcon from "@mui/icons-material/LockPerson";

export interface ModuleLinksProps {
  id: number;
  moduleId: number;
  linkname: string;
  route: string;
  position: number;
  creationDate: string;
  render: number;
  released: number;
}

export interface modulesApiResponse {
  docs: Array<ModuleLinksProps>;
  totalDocs: number;
  totalPages: number;
  page: number;
}

const addeditconfig: addeditprops = {
  addtitle: "Add Link",
  edittitle: "Edit Link",
  variant: "h5",
};

export const validateRequired = (value: string) => !!value.length;
export function validateData(
  data: ModuleLinksProps,
  table: MRT_TableInstance<ModuleLinksProps>
) {
  let position = !validateRequired(data.position.toString())
    ? "Position is required"
    : "";
  let released = !validateRequired(data.released.toString())
    ? "Released is required"
    : "";
  if (table.getState().creatingRow) {
    position = "";
    released = "";
  }
  return {
    linkname: !validateRequired(data.linkname) ? "Link name is required" : "",
    route: !validateRequired(data.route) ? "Route is required" : "",
    position,
    released,
  };
}

const ModulesLinks = (props: any) => {
  const { params, navigate } = props.router as RouterContextType;
  const { manual, setManual: setTableManual } = useTableContext();
  const [pmanual, setPManual] = useState<boolean>(false);
  const [linkId, setLinkId] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
    }
  );
  const dispatch = useAppDispatch();
  const { token } = useAuthUser();
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );
  const { id } = params;
  const decrypted = decryptUrl(id as string);
  const moreMenuItems: menuitemsProps<ModuleLinksProps>[] = [
    {
      label: "Permission",
      icon: <LockPersonIcon sx={{ color: "#1976d2" }} />,
      onClick(row, _, closeMenu) {
        closeMenu && closeMenu();
        open();
        setLinkId(row.original.id);
        setTitle(`${row.original.linkname} Permissions`);
        setPManual(true);
      },
      render: true,
    },
  ];
  const otherconfigs: tableCols<ModuleLinksProps>[] = [
    {
      accessorKey: "id",
      header: "Id",
      enableEditing: false,
      enableSorting: false,
      Edit: () => null,
    },
    {
      accessorKey: "name",
      header: "name",
      enableEditing: false,
      enableSorting: false,
      Edit: () => null,
    },
    {
      accessorKey: "creationDate",
      header: "Date",
      enableEditing: false,
      Edit: () => null,
      Cell: ({ cell }) => {
        return <>{format(cell.getValue<Date>(), "yyyy-MM-dd hh:mm a")}</>;
      },
    },
    {
      accessorKey: "position",
      header: "Position",
      muiEditTextFieldProps: ({ table }) => ({
        required: table.getState().creatingRow ? true : false,
        hidden: table.getState().creatingRow ? true : false,
        disabled: table.getState().creatingRow != undefined ? true : false,
        error:
          (table.getState().creatingRow && !!validationErrors?.position) ||
          undefined,
        helperText: table.getState().creatingRow && validationErrors?.position,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            position: undefined,
          }),
      }),
    },
    {
      accessorKey: "released",
      header: "Released",
      editVariant: "select",
      editSelectOptions: [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
      Cell: ({ cell }) => {
        return cell.getValue<number>() == 1 ? "Yes" : "No";
      },
      muiEditTextFieldProps: ({}) => ({
        required: true,
        // hidden: table.getState().creatingRow ? true : false,
        // disabled: table.getState().creatingRow != undefined ? true : false,
        error: !!validationErrors?.released,
        helperText: validationErrors?.released,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            released: undefined,
          }),
      }),
    },
    {
      accessorKey: "route",
      header: "Route",
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.route,
        helperText: validationErrors?.route,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            route: undefined,
          }),
      },
    },
    {
      accessorKey: "linkname",
      header: "Link name",
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.linkname,
        helperText: validationErrors?.linkname,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            linkname: undefined,
          }),
      },
    },

    {
      accessorKey: "render",
      header: "Show",
      editVariant: "select",
      editSelectOptions: [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
      Cell: ({ cell }) => {
        return cell.getValue<number>() == 1 ? "Yes" : "No";
      },
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.render,
        helperText: validationErrors?.render,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            render: undefined,
          }),
      },
    },
  ];
  useEffect(() => {
    if (!decrypted) {
      navigate("/notfound");
    }
  }, [decrypted]);
  useEffect(() => {
    dispatch(setHeaderText("Manage Module Links"));
  }, []);

  const { data, refetch, isLoading, isError, isFetching, error } =
    useApiQuery<modulesApiResponse>({
      url: `/modules/links/${decrypted}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      manual,
    });
  useEffect(() => {
    if (data?.data?.docs) {
      setTableManual(false);
    }
  }, [data, manual]);
  return (
    <div>
      <ServerSideTable<ModuleLinksProps>
        refetch={refetch}
        title={"Link"}
        data={data?.data?.docs ?? []}
        isError={isError}
        isLoading={isLoading}
        deleteUrl={"modules/links/" + decrypted}
        totalDocs={data?.data?.totalDocs ?? 0}
        isFetching={isFetching}
        error={error}
        tablecolumns={[
          { name: "id", type: "text" },
          { name: "name", type: "text" },
          { name: "linkname", type: "text" },
          { name: "route", type: "text" },
          { name: "position", type: "text" },
          { name: "released", type: "text" },
          { name: "render", type: "text" },
        ]}
        setManual={setTableManual}
        enableEditing={true}
        postDataProps={{
          addurl: "/modules/links/" + decrypted,
          dataFields: ["linkname", "position", "route", "render", "released"],
          editurl: (row) => `modules/links/${decrypted}/${row.id}`,
        }}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        showback={true}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        validateData={validateData}
        addeditprops={addeditconfig}
        columnConfigs={otherconfigs}
        createCallback={(values) => {
          let newvalues = values;
          newvalues["position"] = 0;
          return newvalues;
        }}
        moreMenuItems={moreMenuItems}
        editCallback={() => dispatch(setManual(true))}
      />
      <ModulePermissions
        visible={opened}
        close={close}
        pmanual={pmanual}
        setPManual={setPManual}
        linkId={linkId}
        title={title}
      />
    </div>
  );
};
const LinkWithVerified = withAuthentication(
  withRouter(withRouteRole(ModulesLinks))
);
const LinkWithAcceptedRoles = withRolesVerify(LinkWithVerified);
export default LinkWithAcceptedRoles;
