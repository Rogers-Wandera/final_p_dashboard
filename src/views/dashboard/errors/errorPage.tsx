import {
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from "@mantine/core";
import imageDefault from "../../../assets/images/error/PngItem_2529729.png";
import classes from "./error.module.css";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

type props = {
  titel?: string;
  message: string;
  image?: string;
  button?: {
    text: string;
    link: string;
  };
};
export function ErrorPage({ titel, message, image, button }: props) {
  const navigate = useNavigate();
  const media = useMediaQuery("(min-width: 56.25em)");
  return (
    <Container className={classes.error_root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        {!media && <Image src={image || imageDefault} />}

        <div>
          <Title className={classes.error_title}>
            {titel || "Something is not right..."}
          </Title>
          <Text c="dimmed" size="lg">
            {message}
          </Text>
          {button && (
            <Button
              variant="outline"
              size="md"
              mt="xl"
              className={classes.error_control}
              onClick={() => navigate(button.link)}
            >
              {button.text}
            </Button>
          )}
        </div>
        {media && (
          <Image
            src={image || imageDefault}
            className={classes.error_desktopImage}
          />
        )}
      </SimpleGrid>
    </Container>
  );
}
