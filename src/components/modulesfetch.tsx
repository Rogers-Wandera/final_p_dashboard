import { useEffect } from "react";
// import { ModulesType, setModules } from "../store/services/auth";
import withRouter from "../hoc/withRouter";
import { useAuthUser } from "../contexts/authcontext";
// import { useAppDispatch } from "../hooks/hook";
// import { useApiQuery } from "../helpers/apiquery";
import withAuthentication from "../hoc/withUserAuth";

const ModulesAuth = (props: any) => {
  const { user, token } = useAuthUser();
  //   const dispatch = useAppDispatch();
  const location = props.router.location;
  //   const url = "/modules/linkroles/user/view";
  //   const { refetch } = useApiQuery<ModulesType>({
  //     url,
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  useEffect(() => {
    if (token !== "") {
      //   refetch().then((newdata) => {
      //     if (newdata?.data?.status === 200) {
      //       dispatch(setModules(newdata?.data?.data));
      //     }
      //   });
    }
  }, [token, user, location]);
  return <div></div>;
};

export default withAuthentication(withRouter(ModulesAuth));
