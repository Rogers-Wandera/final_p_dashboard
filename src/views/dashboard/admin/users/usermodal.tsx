import {
  Box,
  Button,
  Grid,
  Group,
  Modal,
  PasswordInput,
  Popover,
  Progress,
  Select,
  TextInput,
} from "@mantine/core";
import { joiResolver, useForm } from "@mantine/form";
import { userformtype } from "./configs/user";
import InputIcon from "@mui/icons-material/Input";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import LockIcon from "@mui/icons-material/Lock";
import { useTableTheme } from "../../../../helpers/tabletheme";
import joi from "joi";
import { withoutuppercase } from "../../../../assets/defaults/passwordrequirements";
import {
  PasswordRequirement,
  getStrength,
} from "../../../../components/modals/formmodal/formconfigs";
import { useState } from "react";

const validation = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  gender: joi.string().required(),
  position: joi.string().required(),
  tel: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  confirmpassword: joi.string().required(),
});

export type userformmodal = {
  opened: boolean;
  close: () => void;
  title?: string;
  positions: { value: string; label: string }[];
  handleSubmit: (values: userformtype) => Promise<void>;
};
const UserModal = ({
  opened,
  close,
  positions,
  handleSubmit,
  title = "Add User",
}: userformmodal) => {
  const [popoverOpened, setPopoverOpened] = useState({
    password: false,
    confirmPassword: false,
  });
  const theme = useTableTheme();
  const form = useForm<userformtype>({
    name: "USERFORM",
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      gender: "",
      position: "",
      tel: "",
    },
    validate: joiResolver(validation),
  });
  let requirements = withoutuppercase || [];
  const strength = (field: "password" | "confirmpassword") => {
    return getStrength(form.getInputProps(field).value || "", 8, requirements);
  };
  const color = (field: "password" | "confirmpassword") =>
    strength(field) === 100 ? "teal" : strength(field) > 50 ? "yellow" : "red";
  const checks = (field: "password" | "confirmpassword") => {
    return requirements.map((requirement, index) => (
      <PasswordRequirement
        key={index}
        label={requirement.label}
        meets={requirement.re.test(form.getInputProps(field).value || "")}
      />
    ));
  };
  const morecheck = (
    <PasswordRequirement
      label="Matches Password"
      meets={
        form.getInputProps("password").value ===
        form.getInputProps("confirmpassword").value
      }
    />
  );
  return (
    <Modal
      title={title}
      opened={opened}
      onClose={() => {
        close();
        form.reset();
      }}
      centered
      size="lg"
      styles={{
        content: { backgroundColor: theme.palette.background.default },
        header: { backgroundColor: theme.palette.background.default },
        title: { fontSize: "1.3rem", fontWeight: "bold" },
      }}
    >
      <Box maw={1000} mx="auto">
        <form
          onSubmit={form.onSubmit(async (values) => {
            await handleSubmit(values);
            form.reset();
          })}
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk={true}
                label="First Name"
                {...form.getInputProps("firstname")}
                leftSection={<InputIcon />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk={true}
                label="Last Name"
                {...form.getInputProps("lastname")}
                leftSection={<KeyboardIcon />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk={true}
                label="Email"
                {...form.getInputProps("email")}
                leftSection={<InputIcon />}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Popover
                opened={popoverOpened.password}
                position="bottom"
                zIndex={3000}
                width="target"
                transitionProps={{ transition: "pop" }}
              >
                <Popover.Target>
                  <div
                    onFocusCapture={() =>
                      setPopoverOpened({
                        password: true,
                        confirmPassword: false,
                      })
                    }
                    onBlurCapture={() =>
                      setPopoverOpened({ ...popoverOpened, password: false })
                    }
                  >
                    <PasswordInput
                      withAsterisk={true}
                      label="Password"
                      {...form.getInputProps("password")}
                      leftSection={<LockIcon />}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Progress
                    color={color("password")}
                    value={strength("password")}
                    size={5}
                    mb="xs"
                  />
                  <PasswordRequirement
                    label={`Includes at least 8 characters`}
                    meets={
                      form.getInputProps("password").value?.length > 7 || false
                    }
                  />
                  {checks("password")}
                </Popover.Dropdown>
              </Popover>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Popover
                opened={popoverOpened.confirmPassword}
                position="bottom"
                zIndex={3000}
                width="target"
                transitionProps={{ transition: "pop" }}
              >
                <Popover.Target>
                  <div
                    onFocusCapture={() =>
                      setPopoverOpened({
                        password: false,
                        confirmPassword: true,
                      })
                    }
                    onBlurCapture={() =>
                      setPopoverOpened({
                        ...popoverOpened,
                        confirmPassword: false,
                      })
                    }
                  >
                    <PasswordInput
                      withAsterisk={true}
                      label="Confirm Password"
                      {...form.getInputProps("confirmpassword")}
                      leftSection={<LockIcon />}
                    />
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Progress
                    color={color("confirmpassword")}
                    value={strength("confirmpassword")}
                    size={5}
                    mb="xs"
                  />
                  <PasswordRequirement
                    label={`Includes at least 8 characters`}
                    meets={
                      form.getInputProps("confirmpassword").value?.length > 7 ||
                      false
                    }
                  />
                  {checks("confirmpassword")}
                  {morecheck}
                </Popover.Dropdown>
              </Popover>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Select
                withAsterisk={true}
                label="Choose Gender"
                searchable
                data={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                {...form.getInputProps("gender")}
                leftSection={<InputIcon />}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Select
                withAsterisk={true}
                label="Position"
                searchable
                data={positions}
                {...form.getInputProps("position")}
                leftSection={<KeyboardIcon />}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk={true}
                label="Tel"
                {...form.getInputProps("tel")}
                leftSection={<InputIcon />}
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="md">
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
};

export default UserModal;
