import { Card, Group, Text, Menu, ActionIcon, Image, rem } from "@mantine/core";
import { IconDots, IconEye } from "@tabler/icons-react";
import { recognizedperson } from "../../../../app/types";
import { Carousel } from "@mantine/carousel";

type Props = {
  people: recognizedperson[];
};

const RecognitionsDisplay = ({ people }: Props) => {
  return (
    <Carousel height={500} loop withIndicators>
      {people.map((person) => {
        return (
          <Carousel.Slide key={person.id}>
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Text fw={500}>
                    <span>Name: {person.personName} </span>
                    <br />
                    <span>Confidence: {person.confidence}%</span>
                  </Text>
                  <Menu withinPortal position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDots style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={
                          <IconEye
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        Details
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card.Section>

              <Text mt="sm" c="dimmed" size="sm">
                <Text span inherit c="var(--mantine-color-anchor)">
                  <span>Ranking: {person.ranking}</span>
                </Text>
                <Text c="var(--mantine-color-anchor)">
                  <span>Model: {person.modelType}</span>
                </Text>
              </Text>

              <Card.Section mt="sm">
                <Image
                  //   fit="contain"
                  radius="md"
                  src={person.PersonImages[0].imageUrl}
                  height={450}
                />
              </Card.Section>
            </Card>
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
};

export default RecognitionsDisplay;
