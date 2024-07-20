import {
  Card,
  Group,
  Text,
  Image,
  Avatar,
  Badge,
  Tooltip,
} from "@mantine/core";
import { IconThumbDown, IconEye, IconThumbUp } from "@tabler/icons-react";
import { recognizedperson } from "../../../../app/types";
import AudioView from "../../admin/people/manage/audio";

type Props = {
  person: recognizedperson;
  show: {
    toggler: boolean;
    slide: number;
  };
  setShow?: React.Dispatch<
    React.SetStateAction<{
      toggler: boolean;
      slide: number;
    }>
  >;
  setPredictedSources?: React.Dispatch<
    React.SetStateAction<{
      imgs: string[];
    }>
  >;
  updateMatch?: (
    classifierId: number,
    found: 1 | 0,
    personId: string
  ) => Promise<void>;
  people: recognizedperson[];
};

const RecognitionsDisplay = ({
  person,
  show,
  updateMatch,
  setShow = () => {},
  setPredictedSources = () => {},
  people,
}: Props) => {
  const match = people.find((person) => person.match === 1);
  let isPersonMatch = false;
  if (match) {
    if (match.Person.id === person.Person.id) {
      isPersonMatch = true;
    }
  }
  return (
    <Card withBorder radius="md" p={0} className="mantine-card-override1">
      <Group wrap="nowrap" gap={0}>
        <Image
          src={person.PersonImages[0].imageUrl}
          height={200}
          alt={person.personName}
          onClick={() => {
            setPredictedSources({
              imgs: person.PersonImages.map((image) => image.imageUrl),
            });
            setShow({ toggler: !show.toggler, slide: 1 });
          }}
        />

        <div className="mantine-body-override1">
          <Group justify="flex-end">
            <Text tt="uppercase" c="dimmed" fw={700} size="xs">
              Name: {person.personName}
            </Text>
            <Tooltip
              zIndex={1000}
              label={`View ${person.personName}'s details`}
            >
              <IconEye size={25} color="green" style={{ cursor: "pointer" }} />
            </Tooltip>
          </Group>
          <Text className="mantine-title-override1" mt="xs" mb="md">
            Confidence: {person.confidence}%
          </Text>
          <Text className="mantine-title-override1" mt="xs" mb="md">
            Ranking: {person.ranking}
          </Text>
          <Group wrap="nowrap" gap="xs">
            <Group gap="xs" wrap="nowrap">
              <Avatar
                size={20}
                src={
                  person.PersonImages.length > 1
                    ? person.PersonImages[1].imageUrl
                    : person.PersonImages[0].imageUrl
                }
              />
            </Group>
            <Text tt="uppercase" c="dimmed" fw={700} size="xs">
              Model: {person.modelType}
            </Text>
          </Group>
          <Group justify="flex-end" gap="xl" mt={10}>
            {!match && (
              <>
                {person.confidence >= 70 && (
                  <Badge color="blue">Exact Match</Badge>
                )}
                {person.confidence <= 49 ? (
                  <Badge color="red">Posibility</Badge>
                ) : person.confidence <= 69 ? (
                  <Badge color="pink">Similar</Badge>
                ) : null}
              </>
            )}
            {isPersonMatch && <Badge color="blue">Exact Match</Badge>}
            {!match && (
              <Tooltip label="Mark as Match">
                <IconThumbUp
                  size={25}
                  onClick={() =>
                    updateMatch &&
                    updateMatch(person.classifierId, 1, person.personId)
                  }
                  color="green"
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            )}

            {isPersonMatch && (
              <Tooltip label="Mark as no match">
                <IconThumbDown
                  size={25}
                  onClick={() =>
                    updateMatch &&
                    updateMatch(person.classifierId, 0, person.personId)
                  }
                  color="red"
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            )}
          </Group>
        </div>
      </Group>
    </Card>
  );
};

export default RecognitionsDisplay;
