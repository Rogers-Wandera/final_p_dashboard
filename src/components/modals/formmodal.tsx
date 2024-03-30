import {
  Modal,
  MantineSize,
  ModalBaseOverlayProps,
  Text,
  Box,
  TextInput,
  Grid,
  Group,
  Button,
  NumberInput,
  PasswordInput,
  CheckIcon,
  rem,
  Popover,
  Progress,
  Radio,
  Textarea,
  FileInput,
  Checkbox,
  Tooltip,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Cancel } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { passwordrequirements } from "../../assets/defaults/passwordrequirements";
import { DatePickerInput } from "@mantine/dates";

interface formmodalprops {
  opened: boolean;
  close: () => void;
  title: string;
  size?: number | MantineSize | (string & {});
  overlayProps?: ModalBaseOverlayProps | undefined;
  description?: string;
  elements: formcomponentsprops[];
}

export interface formcomponentsprops {
  inputtype: string;
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
  formgrid: formgridprops;
  otherprops?: {
    [key: string]: any;
  };
  validator?: {
    requirements: passwordrequirements[];
    pwlength: number;
  };
  selectdata?: Array<any>;
}

export interface formgridprops {
  span?: { base: number; md: number; lg: number } | number | "auto";
}

function FormModal({
  opened,
  close,
  title,
  overlayProps = { backgroundOpacity: 0.5, blur: 3 },
  size = "lg",
  description = "",
  elements = [],
}: formmodalprops) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const form = useForm({});
  useEffect(() => {
    if (elements.length > 0) {
      elements.forEach((ele) => {
        form.setInitialValues({ [ele.name]: ele.initialvalue });
      });
    }
  }, [elements]);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        centered
        overlayProps={overlayProps}
        size={size}
      >
        {description !== "" && <Text>{description}</Text>}
        {/* Modal content */}
        <Box maw={1000} mx="auto">
          <form action="">
            <Grid>
              {elements.map((ele, index) => {
                let strength = 0;
                let requirements = ele?.validator?.requirements || [];
                if (ele.inputtype == "password" && requirements.length > 0) {
                  strength = getStrength(
                    form.getInputProps(ele.name).value || "",
                    ele?.validator?.pwlength,
                    requirements
                  );
                }
                const color =
                  strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
                const checks = ele?.validator?.requirements.map(
                  (requirement, index) => (
                    <PasswordRequirement
                      key={index}
                      label={requirement.label}
                      meets={requirement.re.test(
                        form.getInputProps(ele.name).value || ""
                      )}
                    />
                  )
                );
                return (
                  <Grid.Col key={index} span={ele.formgrid.span}>
                    {ele.inputtype == "text" && (
                      <TextInput
                        withAsterisk={ele.required}
                        label={ele.label}
                        placeholder={ele.placeholder}
                        {...form.getInputProps(ele.name)}
                        {...ele.otherprops}
                      />
                    )}
                    {ele.inputtype == "number" && (
                      <NumberInput
                        withAsterisk={ele.required}
                        label={ele.label}
                        placeholder={ele.placeholder}
                        {...form.getInputProps(ele.name)}
                        {...ele.otherprops}
                      />
                    )}
                    {ele.inputtype == "password" && requirements.length > 0 ? (
                      <Popover
                        opened={popoverOpened}
                        position="bottom"
                        width="target"
                        transitionProps={{ transition: "pop" }}
                      >
                        <Popover.Target>
                          <div
                            onFocusCapture={() => setPopoverOpened(true)}
                            onBlurCapture={() => setPopoverOpened(false)}
                          >
                            <PasswordInput
                              withAsterisk={ele.required}
                              label={ele.label}
                              placeholder={ele.placeholder}
                              {...form.getInputProps(ele.name)}
                              {...ele.otherprops}
                            />
                          </div>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Progress
                            color={color}
                            value={strength}
                            size={5}
                            mb="xs"
                          />
                          <PasswordRequirement
                            label="Includes at least 6 characters"
                            meets={
                              form.getInputProps(ele.name).value?.length > 5 ||
                              false
                            }
                          />
                          {checks}
                        </Popover.Dropdown>
                      </Popover>
                    ) : (
                      ele.inputtype == "password" && (
                        <PasswordInput
                          withAsterisk={ele.required}
                          label={ele.label}
                          placeholder={ele.placeholder}
                          {...form.getInputProps(ele.name)}
                          {...ele.otherprops}
                        />
                      )
                    )}
                    {ele.inputtype == "radio" && (
                      <Radio
                        label={ele.label}
                        placeholder={ele.placeholder}
                        {...form.getInputProps(ele.name)}
                        {...ele.otherprops}
                      />
                    )}
                    {ele.inputtype == "textarea" && (
                      <Textarea
                        withAsterisk={ele.required}
                        label={ele.label}
                        placeholder={ele.placeholder}
                        {...form.getInputProps(ele.name)}
                        {...ele.otherprops}
                      />
                    )}
                    {ele.inputtype == "file" && (
                      <FileInput
                        withAsterisk={ele.required}
                        label={ele.label}
                        placeholder={ele.placeholder}
                        clearable
                        {...form.getInputProps(ele.name)}
                        {...ele.otherprops}
                      />
                    )}
                    {ele.inputtype == "checkbox" && (
                      <Tooltip label={ele.label}>
                        <Checkbox
                          label={ele.label}
                          placeholder={ele.placeholder}
                          {...form.getInputProps(ele.name)}
                          {...ele.otherprops}
                        />
                      </Tooltip>
                    )}

                    {ele.inputtype == "select" && (
                      <Select
                        label={ele.label}
                        placeholder={ele.placeholder}
                        {...form.getInputProps(ele.name)}
                        {...ele.otherprops}
                        data={ele.selectdata || []}
                        clearable
                        searchable
                        nothingFoundMessage="Nothing found..."
                      />
                    )}

                    {ele.inputtype == "datepicker" && (
                      <DatePickerInput
                        label={ele.label}
                        placeholder={ele.placeholder}
                        {...form.getInputProps(ele.name)}
                        {...ele.otherprops}
                        clearable
                      />
                    )}
                  </Grid.Col>
                );
              })}
            </Grid>
            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export function getStrength(
  password: string,
  pwlength: number = 5,
  requirements: passwordrequirements[]
) {
  let multiplier = password.length > pwlength ? 0 : 1;
  requirements.forEach((req) => {
    if (!req.re.test(password)) {
      multiplier += 1;
    }
  });
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <CheckIcon style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <Cancel style={{ width: rem(14), height: rem(14) }} />
      )}{" "}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}
export default FormModal;
