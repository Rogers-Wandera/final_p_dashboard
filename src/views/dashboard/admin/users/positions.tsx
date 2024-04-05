import { useEffect, useState } from "react";
import { useTableContext } from "../../../../contexts/tablecontext";
import withRouter from "../../../../hoc/withRouter";
import { useAppDispatch } from "../../../../hooks/hook";
import { MRT_TableInstance, MRT_VisibilityState } from "material-react-table";
import { setHeaderText } from "../../../../store/services/defaults";
import withAuthentication from "../../../../hoc/withUserAuth";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRolesVerify from "../../../../hoc/withRolesVerify";
import {
  ColumnVisibility,
  ServerSideTable,
  tableCols,
} from "../../../../components/tables/serverside";
import { useApiQuery } from "../../../../helpers/apiquery";
import { GenericApiResponse } from "../../../../store/services/apislice";
import { useAuthUser } from "../../../../contexts/authcontext";
import { validateRequired } from "../modules/modulelinks";
import { format } from "date-fns";

export type positiontype = {
  id: number;
  position: string;
  creationDate: string;
  isActive: number;
};
export function validateData(
  data: positiontype,
  _: MRT_TableInstance<positiontype>
) {
  return {
    position: !validateRequired(data.position) ? "Position is required" : "",
  };
}

const Positions = (_: any) => {
  const { manual, setManual } = useTableContext();
  const { token } = useAuthUser();
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );
  const dispatch = useAppDispatch();
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
      isActive: false,
    }
  );
  useEffect(() => {
    dispatch(setHeaderText("Manage Position"));
  }, []);

  const otherconfigs: tableCols<positiontype>[] = [
    {
      accessorKey: "id",
      Edit: () => null,
    },
    {
      accessorKey: "position",
      header: "Position",
      muiEditTextFieldProps: () => ({
        required: true,
        error: !!validationErrors?.position,
        helperText: validationErrors?.position,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            position: undefined,
          }),
      }),
    },
    {
      accessorKey: "creationDate",
      Edit: () => null,
      Cell: ({ cell }) => {
        return <>{format(cell.getValue<Date>(), "yyyy-MM-dd hh:mm a")}</>;
      },
    },
    { accessorKey: "isActive", Edit: () => null },
  ];

  const { data, refetch, isLoading, isError, isFetching, error } = useApiQuery<
    GenericApiResponse<positiontype>
  >({
    url: `/positions`,
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
  const response = data?.data?.docs ?? [];
  return (
    <div>
      <ServerSideTable<positiontype>
        data={response}
        refetch={refetch}
        title="Position"
        tablecolumns={[
          { name: "id", type: "text" },
          { name: "position", type: "text" },
          { name: "creationDate", type: "datetime" },
          { name: "isActive", type: "text" },
        ]}
        totalDocs={data?.data?.totalDocs ?? 0}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        error={error}
        deleteUrl="positions"
        setColumnVisibility={setColumnVisibility}
        setManual={setManual}
        setValidationErrors={setValidationErrors}
        validationErrors={validationErrors}
        columnVisibility={columnVisibility}
        enableEditing={true}
        postDataProps={{
          addurl: "/positions",
          editurl: (row) => `positions/${row.id}`,
          dataFields: ["position"],
        }}
        columnConfigs={otherconfigs}
        validateData={validateData}
      />
    </div>
  );
};
const PositionWithVerified = withAuthentication(
  withRouter(withRouteRole(Positions))
);
const PositionWithAcceptedRoles = withRolesVerify(PositionWithVerified);

export default PositionWithAcceptedRoles;
