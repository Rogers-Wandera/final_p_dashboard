import { useEffect, useState } from "react";
import { MRT_VisibilityState } from "material-react-table";
import {
  ColumnVisibility,
  ServerSideTable,
  addeditprops,
  menuitemsProps,
  tableCols,
} from "../../../../../../components/tables/serverside";
import { useApiQuery } from "../../../../../../helpers/apiquery";
import { useAuthUser } from "../../../../../../contexts/authcontext";
import { useTableContext } from "../../../../../../contexts/tablecontext";
import { format } from "date-fns";
import { Tab } from "react-bootstrap";
import { enqueueSnackbar } from "notistack";
import { DateTimePicker } from "@mantine/dates";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { userrolestype } from "../../manageuser";

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

type assignedrolesprops = {
  userId: string;
  viewer: "Admin" | "User";
  modal_opened: () => void;
  moduleslinks: ModuleLinksProps[];
  userroles: userrolestype[];
};

export function validateData() {
  return {
    expireDate: "",
  };
}
const AssignedRoles = ({
  userId,
  viewer,
  modal_opened,
  moduleslinks,
  userroles,
}: assignedrolesprops) => {
  const { manual, setManual } = useTableContext();
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
    }
  );
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );

  const moreMenuItems: menuitemsProps<ModuleLinksProps>[] = [
    {
      label: "Permissions",
      icon: <LockPersonIcon sx={{ color: "#1976d2" }} />,
      onClick(row, _, closeMenu) {
        closeMenu && closeMenu();
      },
      render: !userroles.find((role) => role.role === 5150),
    },
  ];
  const { token } = useAuthUser();
  const deleterender = viewer === "Admin" ? true : false;
  const otherconfigs: tableCols<ModuleLinksProps>[] = [
    {
      accessorKey: "id",
      header: "Id",
      enableEditing: false,
      enableSorting: false,
      Edit: () => null,
    },
    {
      accessorKey: "expireDate",
      header: "Expiry Date",
      Cell: ({ cell }) => {
        const value = cell.getValue<string | null>();
        const render =
          value === null
            ? "No Expiry"
            : format(new Date(value), "yyyy-MM-dd hh:mm a");
        return <>{render}</>;
      },
      Edit: ({ cell, column, row, table }) => {
        return (
          <DateTimePicker
            label="Expiry Date"
            modalProps={{ zIndex: 1500 }}
            valueFormat="YYYY-MM-DD hh:mm"
            dropdownType="modal"
            onChange={(value) => {
              table.setEditingRow(row);
              if (!value) {
                row._valuesCache[column.id] = cell.getValue<string | null>();
              } else {
                row._valuesCache[column.id] = value;
              }
            }}
          />
        );
      },
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
      accessorKey: "linkname",
      header: "Link name",
      Edit: () => null,
    },
  ];

  const { data, refetch, isLoading, isError, isFetching, error } =
    useApiQuery<modulesApiResponse>({
      url: `/modules/linkroles/assigned/roles/${userId}`,
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
    <Tab.Pane eventKey="second" id="profile-profile">
      <ServerSideTable<ModuleLinksProps>
        refetch={refetch}
        title={"Roles"}
        data={data?.data?.docs ?? []}
        isError={isError}
        isLoading={isLoading}
        deleteUrl={""}
        totalDocs={data?.data?.totalDocs ?? 0}
        isFetching={isFetching}
        error={error}
        tablecolumns={[
          { name: "id", type: "text" },
          { name: "linkname", type: "text" },
          { name: "expireDate", type: "date" },
        ]}
        setManual={setManual}
        enableEditing={true}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        addeditprops={addeditconfig}
        columnConfigs={otherconfigs}
        validateData={validateData}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        moreConfigs={{ createDisplayMode: "custom" }}
        actionprop={{
          editrender: deleterender,
          deleterender: deleterender,
          actiontype: "menu",
        }}
        postDataProps={{
          addurl: "",
          editurl: (row) => `modules/linkroles/${row.id}`,
          dataFields: ["expireDate"],
        }}
        customCallback={(table) => {
          if (moduleslinks.length > 0) {
            table.setCreatingRow(true);
            modal_opened();
          } else {
            enqueueSnackbar("No roles to assign", {
              variant: "info",
              anchorOrigin: { horizontal: "right", vertical: "top" },
            });
          }
        }}
        editCreateCallBack={(values) => {
          values.expireDate = format(
            new Date(values.expireDate),
            "yyyy-MM-dd hh:mm"
          );
          return values;
        }}
        moreMenuItems={moreMenuItems}
      />
    </Tab.Pane>
  );
};

export default AssignedRoles;
