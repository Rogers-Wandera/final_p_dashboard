import { Tab } from "react-bootstrap";
import { useTableContext } from "../../../../../contexts/tablecontext";
import { useApiQuery } from "../../../../../helpers/apiquery";
import { GenericApiResponse } from "../../../../../store/services/apislice";
import { useAuthUser } from "../../../../../contexts/authcontext";
import {
  ColumnVisibility,
  ServerSideTable,
  tableCols,
} from "../../../../../components/tables/serverside";
import { useEffect, useState } from "react";
import { validateRequired } from "../../modules/modules";

export type personmetaprops = {
  personId: string;
};

export type personmetatype = {
  id: number;
  metaName: string;
  metaDesc: string;
  fullName: string;
  createdByName: string;
  isActive: number;
};

export function validateData(data: personmetatype) {
  return {
    metaName: !validateRequired(data.metaName) ? "Title is required" : "",
    metaDesc: !validateRequired(data.metaDesc) ? "Value is required" : "",
  };
}

const PersonMeta = ({ personId }: personmetaprops) => {
  const { manual, setManual } = useTableContext();
  const { token } = useAuthUser();
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );
  const { data, refetch, isLoading, isError, isFetching, error } = useApiQuery<
    GenericApiResponse<personmetatype>
  >({
    url: `/person/meta/${personId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    manual,
  });

  const columnConfigs: tableCols<personmetatype>[] = [
    {
      accessorKey: "metaName",
      header: "Title",
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.metaName,
        helperText: validationErrors?.metaName,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            metaName: undefined,
          }),
      },
    },
    { accessorKey: "createdByName", header: "Creater", Edit: () => null },
    {
      accessorKey: "metaDesc",
      header: "Value",
      muiEditTextFieldProps: {
        required: true,
        multiline: true,
        error: !!validationErrors?.metaDesc,
        helperText: validationErrors?.metaDesc,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            metaDesc: undefined,
          }),
      },
    },
  ];

  useEffect(() => {
    if (data?.data.docs) {
      setManual(false);
    }
  }, [manual, data]);
  return (
    <Tab.Pane eventKey="first" id="person-meta">
      <ServerSideTable<personmetatype>
        data={data?.data.docs || []}
        refetch={refetch}
        title="Person Meta"
        deleteUrl={"person/meta/" + personId}
        deleteOverride={(row) => `/person/meta/${personId}/?metaId=${row.id}`}
        addeditprops={{
          addtitle: "Add Person Meta",
          edittitle: "Edit Person Meta",
        }}
        tablecolumns={[
          { name: "metaName", type: "text" },
          { name: "metaDesc", type: "text" },
          { name: "createdByName", type: "text" },
        ]}
        totalDocs={data?.data.totalDocs || 0}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetching={isFetching}
        setManual={setManual}
        enableEditing={true}
        columnConfigs={columnConfigs}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        validateData={validateData}
        postDataProps={{
          addurl: "/person/meta/" + personId,
          editurl: (row) => "/person/meta/" + personId + "?metaId=" + row.id,
          dataFields: ["metaName", "metaDesc"],
        }}
      />
    </Tab.Pane>
  );
};

export default PersonMeta;
