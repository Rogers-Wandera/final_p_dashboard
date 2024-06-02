import { useEffect, useState } from "react";
import { setHeaderText } from "../../../../store/services/defaults";
import { useAppDispatch } from "../../../../hooks/hook";
import {
  ColumnVisibility,
  ServerSideTable,
  menuitemsProps,
  tableCols,
} from "../../../../components/tables/serverside";
import { useApiQuery } from "../../../../helpers/apiquery";
import { GenericApiResponse } from "../../../../store/services/apislice";
import { useTableContext } from "../../../../contexts/tablecontext";
import { useAuthUser } from "../../../../contexts/authcontext";
import { validateRequired } from "../modules/modules";
import { MRT_VisibilityState } from "material-react-table";
import Person3Icon from "@mui/icons-material/Person3";
import { encryptUrl } from "../../../../helpers/utils";
import withRouter from "../../../../hoc/withRouter";
import withRouteRole from "../../../../hoc/withRouteRole";
import withAuthentication from "../../../../hoc/withUserAuth";

export type persontype = {
  id: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  nationalId: string;
  status: "Alive" | "Deceased";
  fullName: string;
  createdByName: string;
  isActive: number;
};

const moreMenuItems: menuitemsProps<persontype>[] = [
  {
    label: "Manage",
    icon: <Person3Icon sx={{ color: "#1976d2" }} />,
    onClick(row, _, closeMenu, navigate) {
      closeMenu && closeMenu();
      navigate &&
        navigate(
          `/dashboard/admin/persons/manage/${encryptUrl(row.original.id)}`
        );
    },
    render: true,
  },
];

export function validateData(data: persontype) {
  return {
    firstName: !validateRequired(data.firstName)
      ? "First Name is required"
      : "",
    lastName: !validateRequired(data.lastName) ? "Last Name is required" : "",
    nationalId: !validateRequired(data.nationalId) ? "NIN is required" : "",
    gender: !validateRequired(data.gender) ? "Gender is required" : "",
    status: !validateRequired(data.status) ? "Status is required" : "",
  };
}
const Person = () => {
  const dispatch = useAppDispatch();
  const { manual, setManual } = useTableContext();
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );
  const { token } = useAuthUser();
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      firstName: false,
      lastName: false,
    }
  );
  const { data, refetch, isLoading, isError, isFetching, error } = useApiQuery<
    GenericApiResponse<persontype>
  >({
    url: `/person`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    manual,
  });

  const columnConfigs: tableCols<persontype>[] = [
    { accessorKey: "createdByName", header: "Creater", Edit: () => null },
    { accessorKey: "fullName", header: "Full Name", Edit: () => null },
    {
      accessorKey: "firstName",
      header: "First Name",
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.firstName,
        helperText: validationErrors?.firstName,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            firstName: undefined,
          }),
      },
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.lastName,
        helperText: validationErrors?.lastName,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            lastName: undefined,
          }),
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      editVariant: "select",
      editSelectOptions: ["Male", "Female"],
      muiEditTextFieldProps: ({}) => ({
        required: true,
        error: !!validationErrors?.gender,
        helperText: validationErrors?.gender,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            gender: undefined,
          }),
      }),
    },
    {
      accessorKey: "nationalId",
      header: "NIN",
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.nationalId,
        helperText: validationErrors?.nationalId,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            nationalId: undefined,
          }),
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      editVariant: "select",
      editSelectOptions: ["Alive", "Deceased"],
      muiEditTextFieldProps: ({}) => ({
        required: true,
        error: !!validationErrors?.status,
        helperText: validationErrors?.status,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            status: undefined,
          }),
      }),
    },
  ];
  useEffect(() => {
    dispatch(setHeaderText("Manage People"));
  }, []);

  useEffect(() => {
    if (data?.data.docs) {
      setManual(false);
    }
  }, [manual, data]);
  return (
    <div>
      <ServerSideTable<persontype>
        data={data?.data?.docs || []}
        totalDocs={data?.data?.totalDocs || 0}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        title="Person"
        deleteUrl="person"
        enableEditing={true}
        error={error}
        refetch={refetch}
        setManual={setManual}
        columnConfigs={columnConfigs}
        tablecolumns={[
          { name: "fullName", type: "text" },
          { name: "firstName", type: "text" },
          { name: "lastName", type: "text" },
          { name: "gender", type: "text" },
          { name: "nationalId", type: "text" },
          { name: "status", type: "text" },
          { name: "createdByName", type: "text" },
        ]}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        validateData={validateData}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        moreMenuItems={moreMenuItems}
        addeditprops={{
          addtitle: "Add Person",
          edittitle: "Edit Person",
          variant: "h5",
        }}
        postDataProps={{
          addurl: "/person",
          dataFields: [
            "firstName",
            "lastName",
            "gender",
            "nationalId",
            "status",
          ],
          editurl: (row) => `/person/${row.id}`,
        }}
      />
    </div>
  );
};

const AuthenticatedPerson = withAuthentication(
  withRouter(withRouteRole(Person))
);
export default AuthenticatedPerson;
