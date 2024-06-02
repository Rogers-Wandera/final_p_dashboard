import { Grid, Select, Switch, TextInput } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";

type layout = {
  setSelectedDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean | null>>;
  isValid: boolean | null;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
};

const validateUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
};

const LiveLayout = ({
  devices,
  setSelectedDeviceId,
  setChecked,
  setIsValid,
  setUrl,
  isValid,
  checked,
}: layout) => {
  const data = [{ label: "All devices", value: "All" }];
  devices.forEach((device) => {
    data.push({ label: device.label, value: device.deviceId });
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUrl(value);
    setIsValid(validateUrl(value));
  };
  return (
    <Grid>
      <Grid.Col span={8}>
        {checked && (
          <Select
            placeholder="choose connected resource"
            searchable
            defaultValue=""
            clearable
            data={data}
            onChange={(value) => setSelectedDeviceId(value)}
          />
        )}
        {!checked && (
          <div>
            <TextInput
              placeholder="Enter url here"
              error={isValid === false}
              onChange={handleChange}
              rightSection={<IconLink />}
            />
            {isValid === false && (
              <p style={{ color: "red" }}>Please enter a valid URL.</p>
            )}
          </div>
        )}
      </Grid.Col>
      <Grid.Col span={4}>
        <Switch
          checked={checked}
          size="md"
          label={checked ? "Switch to url" : "Switch to connected devices"}
          onLabel="Camera"
          offLabel="Url"
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
      </Grid.Col>
    </Grid>
  );
};

export default LiveLayout;
