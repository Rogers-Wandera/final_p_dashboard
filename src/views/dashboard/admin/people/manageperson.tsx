import { useEffect, useState } from "react";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRouter from "../../../../hoc/withRouter";
import withAuthentication from "../../../../hoc/withUserAuth";
import { useAppDispatch } from "../../../../hooks/hook";
import { setHeaderText } from "../../../../store/services/defaults";
import { useNavigate, useParams } from "react-router-dom";
import { decryptUrl, handleError } from "../../../../helpers/utils";
import { Box, Loader, LoadingOverlay } from "@mantine/core";
import ManagePersonHeader from "./manage/header";
import PersonMeta from "./manage/meta";
import { persontype } from "./person";
import { useAppState } from "../../../../contexts/sharedcontexts";
import { enqueueSnackbar } from "notistack";
import { ViewPersonImages, ViewSinglePerson } from "./manage/personapi";
import { useAuthUser } from "../../../../contexts/authcontext";
import { useDisclosure } from "@mantine/hooks";
import { Col, Row, Tab } from "react-bootstrap";
import PersonImages, { personimagestypes } from "./manage/personimages";
import ManagePersonSideLeft from "./manage/leftside";
import { Image } from "react-grid-gallery";

export interface customImage extends Image {
  publicId: string;
  id: number;
}

const ManagePerson = () => {
  const [person, setPerson] = useState<persontype>({} as persontype);
  const [images, setImages] = useState<personimagestypes[]>([]);
  const [visible, { open, close }] = useDisclosure(false);
  const [reload, setReload] = useState(false);
  const dispatch = useAppDispatch();
  const { personId } = useParams();
  const { token } = useAuthUser();
  const navigate = useNavigate();
  const decrypted = decryptUrl(personId as string);
  const appState = useAppState();

  const HandleFetchDefaults = async () => {
    try {
      open();
      const viewperson = await ViewSinglePerson(decrypted, token);
      const viewimages = await ViewPersonImages(decrypted, token);
      setPerson(viewperson);
      setImages(viewimages);
      close();
    } catch (error) {
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };
  useEffect(() => {
    dispatch(setHeaderText("Manage Person"));
  }, []);

  useEffect(() => {
    HandleFetchDefaults();
  }, [reload]);
  if (!personId) {
    navigate("/notfound");
  }

  if (visible) {
    return (
      <LoadingOverlay
        visible={visible}
        zIndex={1500}
        loaderProps={{ children: <Loader color="blue" type="bars" /> }}
      />
    );
  }
  return (
    <Box>
      <Tab.Container defaultActiveKey="first">
        <ManagePersonHeader person={person} />
        <Row>
          <Col lg="3" className="col-lg-3">
            <ManagePersonSideLeft person={person} />
          </Col>
          <Col lg="9" className="col-g-9">
            <Tab.Content>
              <PersonMeta personId={decrypted} />
              <PersonImages
                personId={decrypted}
                images={images}
                setImages={setImages}
                reload={reload}
                setReload={setReload}
              />
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Box>
  );
};

const AuthenticatedManagePerson = withAuthentication(
  withRouter(withRouteRole(ManagePerson))
);
export default AuthenticatedManagePerson;
