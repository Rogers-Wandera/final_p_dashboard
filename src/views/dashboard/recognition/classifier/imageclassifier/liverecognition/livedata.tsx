import { Person } from "../../../../../../app/types";
import { Badge, Card, Group, Text } from "@mantine/core";

type props = {
  show: boolean;
  data: Partial<Person>;
};
const LiveRecognitionData = ({ show, data }: props) => {
  return (
    <>
      {show && data?.firstName && (
        <Card
          className="footer-xc"
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
        >
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>
              Name: {data.firstName} {data.lastName}
            </Text>
            <Badge color="pink">{data.gender}</Badge>
          </Group>
          <Text size="sm" c="dimmed">
            NIN: {data.nationalId}
          </Text>
        </Card>
      )}
    </>
  );
};

export default LiveRecognitionData;
