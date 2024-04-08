import { Card, Col, Image } from "react-bootstrap";
import { user } from "../../users";
import { Link } from "react-router-dom";

// icons

import icon1 from "../../../../../../assets/images/icons/01.png";
import icon2 from "../../../../../../assets/images/icons/02.png";
import icon3 from "../../../../../../assets/images/icons/03.png";
import icon4 from "../../../../../../assets/images/icons/04.png";
import icon8 from "../../../../../../assets/images/icons/08.png";

import icon5 from "../../../../../../assets/images/icons/05.png";
import shap2 from "../../../../../../assets/images/shapes/02.png";
import shap4 from "../../../../../../assets/images/shapes/04.png";
import shap6 from "../../../../../../assets/images/shapes/06.png";
import DeleteIcon from "@mui/icons-material/Delete";
import { userrolestype } from "../../manageuser";
import { modals } from "@mantine/modals";
import { Text, Tooltip } from "@mantine/core";
import { useDeleteDataMutation } from "../../../../../../store/services/apislice";
import { handleError } from "../../../../../../helpers/utils";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import { enqueueSnackbar } from "notistack";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { rolesresponse } from "../../../../../configurations/roles/roles";

type userpageprops = {
  user: user;
  toggler: boolean;
  setToggler: React.Dispatch<React.SetStateAction<boolean>>;
  userroles: userrolestype[];
  viewer: "Admin" | "User";
  setManual?: React.Dispatch<React.SetStateAction<boolean>>;
  manual?: boolean;
  unassignedroles?: rolesresponse[];
  openmodal?: () => void;
};
const UserSideLeft = ({
  user,
  toggler,
  setToggler,
  userroles,
  viewer,
  setManual = () => {},
  manual = false,
  unassignedroles = [],
  openmodal = () => {},
}: userpageprops) => {
  const appstate = useAppState();
  const [deleterole] = useDeleteDataMutation({});
  const openModal = (roleId: number) =>
    modals.openConfirmModal({
      title: "Remove Role",
      children: (
        <Text>
          Are you sure you want to proceed with this action? This action will
          remove the role from this user until restored. Probably make the user
          logedout of the system
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "#D6589f" },
      onCancel: () => {},
      onConfirm: () => {
        deleterole({
          url: "/admin/roles/",
          data: { roleId: roleId, userId: user.id },
        })
          .unwrap()
          .then((res) => {
            setManual(!manual);
            enqueueSnackbar(res.msg, {
              variant: "success",
              anchorOrigin: { horizontal: "right", vertical: "top" },
            });
          })
          .catch((err) => {
            handleError(err, appstate, enqueueSnackbar);
          });
      },
    });
  return (
    <Col lg="3" className="col-lg-3">
      <Card>
        <Card.Header>
          <div className="header-title">
            {viewer === "Admin" && (
              <h4 className="card-title d-flex justify-content-between">
                <span>Roles List</span>
                <Tooltip label="Add Role" withArrow>
                  <AddBoxIcon
                    sx={{ color: "green", cursor: "pointer" }}
                    onClick={() => {
                      if (unassignedroles.length <= 0) {
                        enqueueSnackbar("No roles to assign to the user", {
                          variant: "info",
                          anchorOrigin: {
                            horizontal: "right",
                            vertical: "top",
                          },
                        });
                        return;
                      }
                      openmodal();
                    }}
                  />
                </Tooltip>
              </h4>
            )}
            {viewer === "User" && (
              <h5 className="card-title">Assigned Roles</h5>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <ul className="list-inline m-0 p-0">
            {userroles.length > 0 &&
              userroles.map((role) => (
                <li
                  className="d-flex mb-2 justify-content-between"
                  key={role.id}
                >
                  {viewer === "Admin" && (
                    <Tooltip
                      multiline
                      w={220}
                      withArrow
                      zIndex={999}
                      transitionProps={{ duration: 200 }}
                      label={role.description}
                    >
                      <p
                        style={{ cursor: "pointer" }}
                        className="news-detail mb-0"
                      >
                        {role.rolename}
                      </p>
                    </Tooltip>
                  )}
                  {viewer === "User" && (
                    <p className="news-detail mb-0">{role.rolename}</p>
                  )}
                  {viewer === "Admin" && (
                    <div className="news-icon me-3">
                      <Tooltip label="Remove Role" withArrow>
                        <DeleteIcon
                          sx={{
                            color: "#D6589f",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => openModal(role.roleId)}
                        />
                      </Tooltip>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header className="d-flex align-items-center justify-content-between">
          <div className="header-title">
            <h4 className="card-title">Gallery</h4>
          </div>
          <span>132 pics</span>
        </Card.Header>
        <Card.Body>
          <div className="d-grid gap-card grid-cols-3">
            <Link onClick={() => setToggler(!toggler)} to="#">
              <Image
                src={icon4}
                className="img-fluid bg-soft-info rounded"
                alt="profile-image"
              />
            </Link>
            <Link onClick={() => setToggler(!toggler)} to="#">
              <Image
                src={shap2}
                className="img-fluid bg-soft-primary rounded"
                alt="profile-image"
              />
            </Link>
            <Link onClick={() => setToggler(!toggler)} to="#">
              <Image
                src={icon8}
                className="img-fluid bg-soft-info rounded"
                alt="profile-image"
              />
            </Link>
            <Link onClick={() => setToggler(!toggler)} to="#">
              <Image
                src={shap4}
                className="img-fluid bg-soft-primary rounded"
                alt="profile-image"
              />
            </Link>
            <Link onClick={() => setToggler(!toggler)} to="#">
              <Image
                src={icon2}
                className="img-fluid bg-soft-warning rounded"
                alt="profile-image"
              />
            </Link>
            <Link onClick={() => setToggler(!toggler)} to="#">
              <Image
                src={shap6}
                className="img-fluid bg-soft-primary rounded"
                alt="profile-image"
              />
            </Link>
            <Link to="#">
              <Image
                onClick={() => setToggler(!toggler)}
                src={icon5}
                className="img-fluid bg-soft-danger rounded"
                alt="profile-image"
              />
            </Link>
            <Link onClick={() => setToggler(!toggler)} to="#">
              <Image
                src={shap4}
                className="img-fluid bg-soft-primary rounded"
                alt="profile-image"
              />
            </Link>
            <Link onClick={() => setToggler(!toggler)} to="#">
              <Image
                src={icon1}
                className="img-fluid bg-soft-success rounded"
                alt="profile-image"
              />
            </Link>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <div className="header-title">
            <h4 className="card-title">Twitter Feeds</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="twit-feed">
            <div className="d-flex align-items-center mb-2">
              <Image
                className="rounded-pill img-fluid avatar-50 me-3 p-1 bg-soft-danger ps-2"
                src={icon3}
                alt=""
              />
              <div className="media-support-info">
                <h6 className="mb-0">Figma Community</h6>
                <p className="mb-0">
                  @figma20
                  <span className="text-primary">
                    <svg width="15" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
            <div className="media-support-body">
              <p className="mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
              <div className="d-flex flex-wrap">
                <Link to="#" className="twit-meta-tag pe-2">
                  #Html
                </Link>
                <Link to="#" className="twit-meta-tag pe-2">
                  #Bootstrap
                </Link>
              </div>
              <div className="twit-date">07 Jan 2021</div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="twit-feed">
            <div className="d-flex align-items-center mb-2">
              <Image
                className="rounded-pill img-fluid avatar-50 me-3 p-1 bg-soft-primary"
                src={icon4}
                alt=""
              />
              <div className="media-support-info">
                <h6 className="mb-0">Flutter</h6>
                <p className="mb-0">
                  @jane59
                  <span className="text-primary">
                    <svg width="15" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
            <div className="media-support-body">
              <p className="mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
              <div className="d-flex flex-wrap">
                <Link to="#" className="twit-meta-tag pe-2">
                  #Js
                </Link>
                <Link to="#" className="twit-meta-tag pe-2">
                  #Bootstrap
                </Link>
              </div>
              <div className="twit-date">18 Feb 2021</div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="twit-feed">
            <div className="d-flex align-items-center mb-2">
              <Image
                className="rounded-pill img-fluid avatar-50 me-3 p-1 bg-soft-warning pt-2"
                src={icon2}
                alt=""
              />
              <div className="mt-2">
                <h6 className="mb-0">Blender</h6>
                <p className="mb-0">
                  @blender59
                  <span className="text-primary">
                    <svg width="15" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
            <div className="media-support-body">
              <p className="mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
              <div className="d-flex flex-wrap">
                <Link to="#" className="twit-meta-tag pe-2">
                  #Html
                </Link>
                <Link to="#" className="twit-meta-tag pe-2">
                  #CSS
                </Link>
              </div>
              <div className="twit-date">15 Mar 2021</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UserSideLeft;
