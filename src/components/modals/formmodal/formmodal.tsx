import {
  Modal,
  MantineSize,
  ModalBaseOverlayProps,
  Text,
  Box,
  Grid,
  Group,
  Button,
} from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { FormEvent, useEffect } from "react";
import {
  passwordrequirements,
  withspecialchars,
} from "../../../assets/defaults/passwordrequirements";
import ModalFormElement from "./element";
import joi from "joi";
import { joiResolver } from "mantine-form-joi-resolver";

interface formmodalprops {
  opened: boolean;
  close: () => void;
  title: string;
  size?: number | MantineSize | (string & {});
  overlayProps?: ModalBaseOverlayProps | undefined;
  description?: string;
  elements: formcomponentsprops[];
  globalconfigs?: globalconfigs;
  selectdata?: selectdataprops[];
  formvalidation?: joi.ObjectSchema<any>;
  buttonconfigs?: buttonconfigs;
}

export interface globalconfigs {
  paswordvalidator?: {
    check?: boolean;
    requirements?: passwordrequirements[];
    pwlength?: number;
    morechecks?: (
      form: UseFormReturnType<
        Record<string, unknown>,
        (values: Record<string, unknown>) => Record<string, unknown>
      >
    ) => { name: string; label: string; checks: boolean }[];
  };
  dateformat?: string;
  datetimeformat?: string;
}

export type buttonconfigs = {
  text?: string;
  handleSubmit?: (
    event: FormEvent<HTMLFormElement>,
    form: UseFormReturnType<
      Record<string, unknown>,
      (values: Record<string, unknown>) => Record<string, unknown>
    >,
    close: () => void
  ) => void;
  type?: "submit" | "reset" | "button";
  [key: string]: any;
};

export interface selectdataprops {
  name: string;
  data: Array<any>;
  notfound?: string;
}

export interface formcomponentsprops {
  inputtype:
    | "text"
    | "textarea"
    | "password"
    | "number"
    | "file"
    | "datepicker"
    | "datetimepicker"
    | "select"
    | "checkbox"
    | "radio";
  label: string;
  name: string;
  initialvalue?:
    | string
    | number
    | boolean
    | Date
    | null
    | undefined
    | Array<any>
    | {};
  placeholder?: string;
  required?: boolean;
  formgrid?: formgridprops;
  otherprops?: {
    [key: string]: any;
  };
  icon?: React.ReactNode;
}

export interface formgridprops {
  span?: { base: number; md: number; lg: number } | number | "auto";
}

const defaultdata: globalconfigs = {
  paswordvalidator: {
    check: true,
    requirements: withspecialchars,
    pwlength: 5,
  },
  dateformat: "YYYY-MM-DD",
  datetimeformat: "YYYY-MM-DD HH:mm",
};

const defaultformgrid: formgridprops = {
  span: { base: 12, md: 6, lg: 6 },
};
function FormModal({
  opened,
  close,
  title,
  overlayProps = { backgroundOpacity: 0.5, blur: 3 },
  size = "lg",
  description = "",
  elements = [],
  globalconfigs = {},
  selectdata = [],
  formvalidation = joi.object({}),
  buttonconfigs = {},
}: formmodalprops) {
  const form = useForm({
    validate: joiResolver(formvalidation),
  });
  const defaultbuttonconfigs: buttonconfigs = {
    text: "Submit",
    type: "submit",
  };
  const globaldata = { ...defaultdata, ...globalconfigs };
  const buttonconfigsdata = { ...defaultbuttonconfigs, ...buttonconfigs };
  useEffect(() => {
    if (elements.length > 0) {
      const initials: Record<string, unknown> = {};
      elements.forEach((ele) => {
        initials[ele.name] = ele.initialvalue;
      });
      form.setInitialValues(initials);
      form.setValues(initials);
    }
  }, [elements]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        centered
        zIndex={1000}
        overlayProps={overlayProps}
        size={size}
      >
        {description !== "" && <Text>{description}</Text>}
        {/* Modal content */}
        <Box maw={1000} mx="auto">
          <form
            onSubmit={(e) => {
              if (buttonconfigs.handleSubmit) {
                buttonconfigs.handleSubmit(e, form, close);
              }
            }}
          >
            <Grid>
              {elements.map((ele, index) => (
                <ModalFormElement
                  element={ele}
                  form={form}
                  globaldata={globaldata}
                  selectdata={selectdata}
                  defaultformgrid={defaultformgrid}
                  key={index}
                />
              ))}
            </Grid>
            <Group justify="flex-end" mt="md">
              <Button type={buttonconfigsdata.type}>
                {buttonconfigsdata.text}
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>
    </>
  );
}
export default FormModal;
