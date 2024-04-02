import { CheckIcon, Text, rem } from "@mantine/core";
import { formcomponentsprops } from "./formmodal";
import { CalendarMonth, Cancel } from "@mui/icons-material";
import InputIcon from "@mui/icons-material/Input";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LockIcon from "@mui/icons-material/Lock";
import { passwordrequirements } from "../../../assets/defaults/passwordrequirements";

export type modalformconfigprops = {
  element: formcomponentsprops;
};
export const modalformconfigs = ({ element }: modalformconfigprops) => {
  let icon: any = null;
  if (
    element.inputtype == "datepicker" ||
    element.inputtype == "datetimepicker"
  ) {
    element.icon
      ? (icon = element.icon)
      : (icon = <CalendarMonth style={{ width: rem(18), height: rem(18) }} />);
  } else if (element.inputtype == "text") {
    element.icon
      ? (icon = element.icon)
      : (icon = <InputIcon style={{ width: rem(18), height: rem(18) }} />);
  } else if (element.inputtype == "textarea") {
    element.icon
      ? (icon = element.icon)
      : (icon = <KeyboardIcon style={{ width: rem(18), height: rem(18) }} />);
  } else if (element.inputtype == "file") {
    element.icon
      ? (icon = element.icon)
      : (icon = <FileUploadIcon style={{ width: rem(18), height: rem(18) }} />);
  } else if (element.inputtype == "password") {
    element.icon
      ? (icon = element.icon)
      : (icon = <LockIcon style={{ width: rem(18), height: rem(18) }} />);
  }
  return { icon };
};

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
      <span style={{ marginLeft: "10px" }}>{label}</span>
    </Text>
  );
}
