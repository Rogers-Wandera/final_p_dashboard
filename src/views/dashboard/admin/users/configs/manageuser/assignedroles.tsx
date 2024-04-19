import { useEffect, useState } from "react";
import { MRT_VisibilityState } from "material-react-table";
import {
  ServerSideTable,
  addeditprops,
  tableCols,
} from "../../../../../../components/tables/serverside";
import { useApiQuery } from "../../../../../../helpers/apiquery";
import { useAuthUser } from "../../../../../../contexts/authcontext";
import { useTableContext } from "../../../../../../contexts/tablecontext";
import { format } from "date-fns";
import { Tab } from "react-bootstrap";
import { enqueueSnackbar } from "notistack";

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
};
const AssignedRoles = ({
  userId,
  viewer,
  modal_opened,
  moduleslinks,
}: assignedrolesprops) => {
  const { manual, setManual } = useTableContext();
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
    }
  );
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
      Edit: () => null,
      Cell: ({ cell }) => {
        const value = cell.getValue<string | null>();
        const render =
          value === null
            ? "No Expiry"
            : format(new Date(value), "yyyy-MM-dd hh:mm a");
        return <>{render}</>;
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
        moreConfigs={{ createDisplayMode: "custom" }}
        actionprop={{
          editrender: false,
          deleterender: deleterender,
          actiontype: "inline",
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
      />
    </Tab.Pane>
  );
};

export default AssignedRoles;
