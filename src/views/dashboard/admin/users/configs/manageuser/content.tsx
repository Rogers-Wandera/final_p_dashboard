import { Tab } from "react-bootstrap";
import UserProfileContent from "./userprofilecontent";
import { user } from "../../users";
import AssignedRoles from "./assignedroles";
import { ModuleLinksProps } from "../../../modules/modulelinks";

export type contentprops = {
  userdata: user;
  viewer: "Admin" | "User";
  userId: string;
  modal_opened: () => void;
  moduleslinks: ModuleLinksProps[];
};
const ContentPage = ({
  userdata,
  viewer,
  userId,
  modal_opened,
  moduleslinks,
}: contentprops) => {
  return (
    <Tab.Content className="profile-content">
      <UserProfileContent userdata={userdata} viewer={viewer} />
      <AssignedRoles
        userId={userId}
        viewer={viewer}
        modal_opened={modal_opened}
        moduleslinks={moduleslinks}
      />
    </Tab.Content>
  );
};

export default ContentPage;
