import {
  TextInput,
  Grid,
  NumberInput,
  PasswordInput,
  Popover,
  Progress,
  Radio,
  Textarea,
  FileInput,
  Checkbox,
  Tooltip,
  Select,
} from "@mantine/core";
import {
  formcomponentsprops,
  formgridprops,
  globalconfigs,
  selectdataprops,
} from "./formmodal";
import {
  PasswordRequirement,
  getStrength,
  modalformconfigs,
} from "./formconfigs";
import { UseFormReturnType } from "@mantine/form";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import { useState } from "react";

export type elementconfigs = {
  element: formcomponentsprops;
  selectdata?: selectdataprops[];
  defaultformgrid?: formgridprops;
  globaldata?: globalconfigs;
  form: UseFormReturnType<
    Record<string, unknown>,
    (values: Record<string, unknown>) => Record<string, unknown>
  >;
};

const ModalFormElement = ({
  element: ele,
  form,
  globaldata = {},
  selectdata = [],
  defaultformgrid = {},
}: elementconfigs) => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const moreconfigs = modalformconfigs({ element: ele });
  const icon = moreconfigs?.icon;
  let selectdatainput = [];
  let pwordlength = globaldata?.paswordvalidator?.pwlength
    ? globaldata?.paswordvalidator?.pwlength - 1
    : 5;
  let message = "Nothing found.....";
  if (ele.inputtype == "select") {
    if (selectdata.length > 0) {
      const dt = selectdata.find((item) => item.name == ele.name);
      if (dt) {
        selectdatainput = dt.data;
        message = dt.notfound || "Nothing found.....";
      }
    }
  }
  const colsgrid = ele.formgrid ? ele.formgrid : defaultformgrid;
  let strength = 0;
  let requirements = globaldata?.paswordvalidator?.requirements || [];
  if (ele.inputtype == "password" && requirements.length > 0) {
    strength = getStrength(
      form.getInputProps(ele.name).value || "",
      globaldata?.paswordvalidator?.pwlength,
      requirements
    );
  }
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.getInputProps(ele.name).value || "")}
    />
  ));
  if (globaldata?.paswordvalidator?.morechecks) {
    const morechecks = globaldata?.paswordvalidator?.morechecks(form);
    if (morechecks.length > 0) {
      morechecks.forEach((check, index) => {
        if (check.name === ele.name) {
          const chk = (
            <PasswordRequirement
              key={check.name + index}
              label={check.label}
              meets={check.checks}
            />
          );
          checks.push(chk);
        }
      });
    }
  }
  return (
    <Grid.Col span={colsgrid.span}>
      {ele.inputtype == "text" && (
        <TextInput
          withAsterisk={ele.required}
          label={ele.label}
          placeholder={ele.placeholder}
          {...form.getInputProps(ele.name)}
          {...ele.otherprops}
          leftSection={icon}
        />
      )}
      {ele.inputtype == "number" && (
        <NumberInput
          withAsterisk={ele.required}
          label={ele.label}
          placeholder={ele.placeholder}
          {...form.getInputProps(ele.name)}
          {...ele.otherprops}
          leftSection={icon}
        />
      )}
      {ele.inputtype == "password" && globaldata?.paswordvalidator?.check ? (
        <Popover
          opened={popoverOpened}
          position="bottom"
          zIndex={1000}
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
                leftSection={icon}
              />
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <Progress color={color} value={strength} size={5} mb="xs" />
            <PasswordRequirement
              label={`Includes at least ${pwordlength + 1} characters`}
              meets={
                form.getInputProps(ele.name).value?.length > pwordlength ||
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
            leftSection={icon}
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
          leftSection={icon}
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
          leftSection={icon}
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
          data={selectdatainput}
          clearable
          searchable
          comboboxProps={{
            zIndex: 1000,
            position: "bottom",
            middlewares: { flip: false, shift: false },
          }}
          withAsterisk={ele.required}
          nothingFoundMessage={message}
          checkIconPosition="left"
        />
      )}

      {ele.inputtype == "datepicker" && (
        <DatePickerInput
          label={ele.label}
          placeholder={ele.placeholder}
          {...form.getInputProps(ele.name)}
          {...ele.otherprops}
          popoverProps={{ zIndex: 1000 }}
          valueFormat={globaldata.dateformat}
          clearable
          leftSection={icon}
        />
      )}

      {ele.inputtype == "datetimepicker" && (
        <DateTimePicker
          label={ele.label}
          popoverProps={{ zIndex: 1000 }}
          placeholder={ele.placeholder}
          {...form.getInputProps(ele.name)}
          {...ele.otherprops}
          valueFormat={globaldata.datetimeformat}
          clearable
          leftSection={icon}
        />
      )}
    </Grid.Col>
  );
};

export default ModalFormElement;
