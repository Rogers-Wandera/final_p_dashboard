import { fetchApi } from "../../../../../../helpers/apiquery";
import { rolesresponse } from "../../../../../configurations/roles/roles";
import { userrolestype } from "../../manageuser";
import { user } from "../../users";

const baseqry: string = import.meta.env.VITE_NODE_BASE_URL;
export const HandleGetUser = async (
  userId: string,
  token: string
): Promise<user> => {
  try {
    const response = await fetchApi<user>(
      `${baseqry}/user/users/${userId}`,
      "GET",
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    return {} as user;
  }
};

export const HandleGetUserRoles = async (
  userId: string,
  token: string
): Promise<userrolestype[]> => {
  try {
    const response = await fetchApi<userrolestype[]>(
      `${baseqry}/admin/roles/${userId}`,
      "GET",
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    return [] as userrolestype[];
  }
};

export const HandleGetUnAssignedRoles = async (
  userId: string,
  token: string
): Promise<rolesresponse[]> => {
  try {
    const response = await fetchApi<rolesresponse[]>(
      `${baseqry}/sysroles/unassigned/${userId}`,
      "GET",
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    return [];
  }
};
