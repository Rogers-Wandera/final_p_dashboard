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
import { UseFormReturnType } from "@mantine/form";
import { FormEvent } from "react";
import {
  passwordrequirements,
  withspecialchars,
} from "../../../assets/defaults/passwordrequirements";
import ModalFormElement from "./element";
import { useTableTheme } from "../../../helpers/tabletheme";

interface formmodalprops<T extends Record<string, unknown>> {
  forminstance: UseFormReturnType<T, (values: T) => T>;
  opened: boolean;
  close: () => void;
  title: string;
  size?: number | MantineSize | (string & {});
  overlayProps?: ModalBaseOverlayProps | undefined;
  description?: string;
  elements: formcomponentsprops[];
  globalconfigs?: globalconfigs<T>;
  selectdata?: selectdataprops[];
  buttonconfigs?: buttonconfigs<T>;
}

export interface globalconfigs<T extends Record<string, unknown>> {
  paswordvalidator?: {
    check?: boolean;
    requirements?: passwordrequirements[];
    pwlength?: number;
    morechecks?: (
      form: UseFormReturnType<T, (values: T) => T>
    ) => { name: string; label: string; checks: boolean }[];
  };
  dateformat?: string;
  datetimeformat?: string;
}

export type buttonconfigs<T extends Record<string, unknown>> = {
  text?: string;
  handleSubmit?: (
    event: FormEvent<HTMLFormElement>,
    form: UseFormReturnType<T, (values: T) => T>,
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

const defaultformgrid: formgridprops = {
  span: { base: 12, md: 6, lg: 6 },
};
function FormModal<T extends Record<string, unknown>>({
  opened,
  close,
  forminstance,
  title,
  overlayProps = { backgroundOpacity: 0.5, blur: 3 },
  size = "lg",
  description = "",
  elements = [],
  globalconfigs = {},
  selectdata = [],
  buttonconfigs = {},
}: formmodalprops<T>) {
  const theme = useTableTheme();
  const defaultdata: globalconfigs<T> = {
    paswordvalidator: {
      check: true,
      requirements: withspecialchars,
      pwlength: 5,
    },
    dateformat: "YYYY-MM-DD",
    datetimeformat: "YYYY-MM-DD hh:mm",
  };
  const form = forminstance;
  const defaultbuttonconfigs: buttonconfigs<T> = {
    text: "Submit",
    type: "submit",
  };
  const globaldata = { ...defaultdata, ...globalconfigs };
  const buttonconfigsdata = { ...defaultbuttonconfigs, ...buttonconfigs };
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        centered
        styles={{
          content: { backgroundColor: theme.palette.background.default },
          header: { backgroundColor: theme.palette.background.default },
          title: { fontSize: "1.3rem", fontWeight: "bold" },
        }}
        zIndex={999}
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
