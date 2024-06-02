import { Tab } from "react-bootstrap";
import UserProfileContent from "./userprofilecontent";
import { user } from "../../users";
import AssignedRoles, { ModuleLinksProps } from "./assignedroles";
import { userrolestype } from "../../manageuser";

export type contentprops = {
  userdata: user;
  viewer: "Admin" | "User";
  userId: string;
  modal_opened: () => void;
  moduleslinks: ModuleLinksProps[];
  userroles: userrolestype[];
  open: () => void;
  close: () => void;
  loader: boolean;
};
const ContentPage = ({
  userdata,
  viewer,
  userId,
  modal_opened,
  moduleslinks,
  userroles,
  open,
  close,
  loader,
}: contentprops) => {
  return (
    <Tab.Content className="profile-content">
      <UserProfileContent userdata={userdata} viewer={viewer} />
      <AssignedRoles
        userId={userId}
        viewer={viewer}
        modal_opened={modal_opened}
        moduleslinks={moduleslinks}
        userroles={userroles}
        userdata={userdata}
        loader={{ open, close, loader }}
      />
    </Tab.Content>
  );
};

export default ContentPage;
