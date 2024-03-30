import { decryptUrl } from "../../../../helpers/utils";
import withAuthentication from "../../../../hoc/withUserAuth";
import { useEffect, useState } from "react";
import withRouter, { RouterContextType } from "../../../../hoc/withRouter";
import { useAppDispatch } from "../../../../hooks/hook";
import { setHeaderText } from "../../../../store/services/defaults";
import { MRT_TableInstance, MRT_VisibilityState } from "material-react-table";
import {
  ColumnVisibility,
  ServerSideTable,
  addeditprops,
  tableCols,
} from "../../../../components/tables/serverside";
import { useApiQuery } from "../../../../helpers/apiquery";
import { useAuthUser } from "../../../../contexts/authcontext";
import { useTableContext } from "../../../../contexts/tablecontext";
import { format } from "date-fns";

export interface ModuleLinksProps {
  id: number;
  moduleId: number;
  linkname: string;
  route: string;
  position: number;
  creationDate: string;
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
  const { manual, setManual } = useTableContext();
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
      muiEditTextFieldProps: ({ table }) => ({
        required: table.getState().creatingRow ? true : false,
        hidden: table.getState().creatingRow ? true : false,
        disabled: table.getState().creatingRow != undefined ? true : false,
        error:
          (table.getState().creatingRow && !!validationErrors?.released) ||
          undefined,
        helperText: table.getState().creatingRow && validationErrors?.released,
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
      setManual(false);
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
        ]}
        setManual={setManual}
        enableEditing={true}
        postDataProps={{
          addurl: "/modules/links/" + decrypted,
          dataFields: ["linkname", "position", "route"],
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
          newvalues["released"] = 0;
          return newvalues;
        }}
      />
    </div>
  );
};
export default withAuthentication(withRouter(ModulesLinks));
