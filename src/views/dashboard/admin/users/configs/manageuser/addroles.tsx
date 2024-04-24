import { FormEvent, useEffect, useState } from "react";
import FormModal, {
  formcomponentsprops,
  selectdataprops,
} from "../../../../../../components/modals/formmodal/formmodal";
import { selectoptionstype } from "./userdataapi";
import { ModuleLinksProps } from "../../../modules/modulelinks";
import { UseFormReturnType, joiResolver, useForm } from "@mantine/form";
import { handleError } from "../../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import Joi from "joi";
import { format } from "date-fns";
import { usePostDataMutation } from "../../../../../../store/services/apislice";
import { useTableContext } from "../../../../../../contexts/tablecontext";
// import JoiDate from "@joi/date";

export type openaddroles = {
  open: boolean;
  close: () => void;
  modules: selectoptionstype[];
  modulelinks: ModuleLinksProps[];
  userId: string;
  openprogress: () => void;
  closeprogress: () => void;
};
const validation = Joi.object({
  linkId: Joi.number().required().messages({
    "any.required": "Role is required",
    "number.base": "Role must be a number",
  }),
  expireDate: Joi.date().required().messages({
    "any.required": "Expire Date is required",
    "date.base": "Expire Date must be a date",
  }),
  moduleId: Joi.number().optional().messages({
    "any.required": "Module is required",
    "number.base": "Module must be a number",
  }),
});
export type addrolesformtype = {
  linkId: string;
  expireDate: string;
  moduleId: string;
};
type postrolestype = {
  userId: string;
  linkId: number;
  expireDate: string;
};
const AddRoles = ({
  open,
  close,
  modules,
  modulelinks,
  userId,
  openprogress,
  closeprogress,
}: openaddroles) => {
  const { setManual, manual } = useTableContext();
  const [selectdata, setSelectData] = useState<selectdataprops[]>([
    { name: "module", data: modules, notfound: "No modules found" },
  ]);
  const [postRole] = usePostDataMutation<postrolestype>({});
  const [moduleId, setModuleId] = useState<number>(0);
  const appState = useAppState();
  const form = useForm<addrolesformtype>({
    name: "addroles",
    validate: joiResolver(validation),
    initialValues: {
      linkId: "",
      expireDate: "",
      moduleId: "",
    },
    enhanceGetInputProps: (payload) => {
      if (payload.field === "linkId") {
        return {
          disabled:
            payload.form.values.moduleId === "" ||
            payload.form.values.moduleId === null,
          value:
            payload.form.values.moduleId === "" ||
            payload.form.values.moduleId === null
              ? null
              : payload.form.values.linkId,
        };
      }
    },
    onValuesChange: (values) => {
      if (values.moduleId !== "") {
        setModuleId(parseInt(values.moduleId));
      }
    },
  });
  const elements: formcomponentsprops[] = [
    {
      inputtype: "select",
      label: "Module",
      name: "moduleId",
      otherprops: {},
    },
    {
      inputtype: "select",
      label: "Role",
      name: "linkId",
    },
    {
      inputtype: "datetimepicker",
      label: "Expire Date",
      name: "expireDate",
    },
  ];
  const HandleUpdateModuleLinks = () => {
    try {
      if (moduleId > 0) {
        const moduleslinksdata = modulelinks.filter(
          (item) => item.moduleId === moduleId
        );
        const formatted = moduleslinksdata.map((dt) => {
          return { value: dt.id.toString(), label: dt.linkname };
        });
        return formatted;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  const HandleAddRoles = async (
    event: FormEvent<HTMLFormElement>,
    form: UseFormReturnType<
      addrolesformtype,
      (values: addrolesformtype) => addrolesformtype
    >
  ) => {
    try {
      event.preventDefault();
      openprogress();
      const validation = form.validate();
      if (validation.hasErrors === false) {
        const values = form.values;
        const expiredDate = format(values.expireDate, "yyyy-MM-dd hh:mm");
        const postdata = {
          linkId: values.linkId,
          expireDate: expiredDate,
          userId,
        };
        const response = await postRole({
          url: "/modules/linkroles",
          data: postdata,
        });
        if ("error" in response) {
          throw response.error;
        }
        close();
        setManual(!manual);
        form.reset();
        enqueueSnackbar(response.data.msg, {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
      }
      closeprogress();
    } catch (error) {
      closeprogress();
      handleError(error, appState, enqueueSnackbar);
    }
  };

  useEffect(() => {
    const formatted = HandleUpdateModuleLinks();
    const data = [
      { name: "moduleId", data: modules, notfound: "No modules found" },
      { name: "linkId", data: formatted, notfound: "No roles found" },
    ];
    setSelectData(data);
  }, [moduleId, manual]);
  return (
    <div>
      <FormModal<addrolesformtype>
        opened={open}
        close={close}
        forminstance={form}
        title="Add Roles"
        elements={elements}
        selectdata={selectdata}
        buttonconfigs={{
          text: "Add Role",
          type: "submit",
          handleSubmit: HandleAddRoles,
        }}
      />
    </div>
  );
};

export default AddRoles;
