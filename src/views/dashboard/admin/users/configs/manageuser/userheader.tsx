import { Card, Col, Nav } from "react-bootstrap";
import { user } from "../../users";
import avatars11 from "../../../../../../assets/images/avatars/01.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { IconButton } from "@mui/material";
import { Button, Modal, Tooltip } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { usePostDataMutation } from "../../../../../../store/services/apislice";
import { useDisclosure } from "@mantine/hooks";
import { useTableTheme } from "../../../../../../helpers/tabletheme";
import { Text, Image, SimpleGrid } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { handleError } from "../../../../../../helpers/utils";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "../../../../../../hooks/hook";
import { setSession } from "../../../../../../store/services/defaults";
import { setToken } from "../../../../../../store/services/auth";
import { useConnection } from "../../../../../../contexts/connectioncontext";

export type headeruserprops = {
  userdata: user;
  viewer: "Admin" | "User";
  setManual?: React.Dispatch<React.SetStateAction<boolean>>;
  manual?: boolean;
};

type ModalProps = {
  opened: boolean;
  close: () => void;
  loading?: boolean;
  files: FileWithPath[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
  handleUploadImage: () => void;
};

const ModalUpload = ({
  opened,
  close,
  loading = false,
  files,
  setFiles,
  handleUploadImage,
}: ModalProps) => {
  const theme = useTableTheme();
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div key={index}>
        <Image src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
        <Button
          size="sm"
          variant="gradient"
          style={{ marginTop: "10px" }}
          loading={loading}
          onClick={handleUploadImage}
        >
          <CloudUploadIcon />
        </Button>
      </div>
    );
  });
  return (
    <div>
      <Modal
        centered
        styles={{
          content: { backgroundColor: theme.palette.background.default },
          header: { backgroundColor: theme.palette.background.default },
          title: { fontSize: "1.3rem", fontWeight: "bold" },
        }}
        opened={opened}
        onClose={close}
        title="Upload Profile Image"
      >
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          onDrop={setFiles}
          maxSize={5 * 1024 ** 2}
          multiple={false}
        >
          <Text ta="center">Drop images here</Text>
        </Dropzone>

        <SimpleGrid
          cols={{ base: 1, sm: 4 }}
          mt={previews.length > 0 ? "xl" : 0}
        >
          {previews}
        </SimpleGrid>
      </Modal>
    </div>
  );
};

function UserHeader({
  userdata,
  viewer,
  manual = false,
  setManual = () => {},
}: headeruserprops) {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const socket = useConnection();
  const [uploadimage] = usePostDataMutation();
  const dispatch = useAppDispatch();
  const appState = useAppState();
  const HandleUpdateSession = async () => {
    const response = await uploadimage({
      url: "/refreshtoken/" + userdata.id,
      data: {},
    });
    if ("error" in response) {
      return;
    }
    dispatch(setSession(false));
    dispatch(setToken(response.data.data));
  };
  const handleUploadImage = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("image", files[0]);
      const response = await uploadimage({
        url: "/user/users/profile/upload/" + userdata.id,
        data: formdata,
      });
      if ("error" in response) {
        throw response.error;
      }
      await HandleUpdateSession();
      setLoading(false);
      enqueueSnackbar(response.data.msg, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      close();
      setFiles([]);
      setManual(!manual);
      socket?.emit("clientusersrefresh", {});
    } catch (error) {
      setLoading(false);
      handleError(error, appState, enqueueSnackbar);
    }
  };
  return (
    <Col lg="12">
      <Card>
        <Card.Body>
          <ModalUpload
            opened={opened}
            close={close}
            setFiles={setFiles}
            loading={loading}
            handleUploadImage={handleUploadImage}
            files={files}
          />
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex flex-wrap align-items-center">
              <div className="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                <Image
                  className="theme-color-default-img img-fluid rounded-pill avatar-100"
                  src={
                    userdata.image !== null && userdata.image !== ""
                      ? userdata.image
                      : avatars11
                  }
                  alt={userdata.userName}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (viewer === "User") {
                      open();
                      setFiles([]);
                    }
                  }}
                />
                <div>
                  <Tooltip label="Back">
                    <IconButton aria-label="back" onClick={() => navigate(-1)}>
                      <KeyboardBackspaceIcon
                        fontSize="inherit"
                        color="secondary"
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                <h4 className="me-2 h4">{userdata.userName}</h4>
                <span> - {userdata.position}</span>
              </div>
            </div>
            <Nav
              as="ul"
              className="d-flex nav-pills mb-0 text-center profile-tab"
              data-toggle="slider-tab"
              id="profile-pills-tab"
              role="tablist"
            >
              <Nav.Item as="li">
                <Nav.Link eventKey="first">Profile</Nav.Link>
              </Nav.Item>
              {viewer === "Admin" && (
                <Nav.Item as="li">
                  <Nav.Link eventKey="second">Assign Roles</Nav.Link>
                </Nav.Item>
              )}
              {/* <Nav.Item as="li">
                <Nav.Link eventKey="third">Friends</Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link eventKey="fourth">Profile</Nav.Link>
              </Nav.Item> */}
            </Nav>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default UserHeader;
