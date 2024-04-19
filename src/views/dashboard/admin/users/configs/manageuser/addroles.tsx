import { FormEvent, useEffect, useState } from "react";
import FormModal, {
  formcomponentsprops,
  selectdataprops,
} from "../../../../../../components/modals/formmodal/formmodal";
import { selectoptionstype } from "./userdataapi";
import { ModuleLinksProps } from "../../../modules/modulelinks";
import { UseFormReturnType } from "@mantine/form";
import { handleError } from "../../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import Joi from "joi";

export type openaddroles = {
  open: boolean;
  close: () => void;
  modules: selectoptionstype[];
  modulelinks: ModuleLinksProps[];
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
const AddRoles = ({ open, close, modules, modulelinks }: openaddroles) => {
  const [selectdata, setSelectData] = useState<selectdataprops[]>([
    { name: "module", data: modules, notfound: "No modules found" },
  ]);
  const [moduleId, setModuleId] = useState<number>(0);
  const appState = useAppState();
  const elements: formcomponentsprops[] = [
    {
      inputtype: "select",
      label: "Module",
      name: "moduleId",
      otherprops: {
        onChange: (value: string) => {
          setModuleId(parseInt(value));
        },
      },
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
      Record<string, unknown>,
      (values: Record<string, unknown>) => Record<string, unknown>
    >
  ) => {
    try {
      event.preventDefault();
      const validation = form.validate();
      if (validation.hasErrors === false) {
      }
    } catch (error) {
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
  }, [moduleId]);
  return (
    <div>
      <FormModal
        opened={open}
        close={close}
        title="Add Roles"
        formname="addroles"
        elements={elements}
        formvalidation={validation}
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
