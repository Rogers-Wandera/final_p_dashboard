import { Grid, Switch, TextInput } from "@mantine/core";
import { AudioRecorder } from "react-audio-voice-recorder";
import { IconLink } from "@tabler/icons-react";

type layout = {
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

const LayOut = ({
  checked,
  setChecked,
  isValid,
  setIsValid,
  setUrl,
}: layout) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUrl(value);
    setIsValid(validateUrl(value));
  };
  return (
    <Grid>
      <Grid.Col span={8}>
        {checked && <AudioRecorder />}
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
          label={checked ? "Switch to url" : "Switch to devices"}
          onLabel="Devices"
          offLabel="Url"
          checked={checked}
          size="lg"
          onClick={(event) => setChecked(event.currentTarget.checked)}
        />
      </Grid.Col>
    </Grid>
  );
};

export default LayOut;
