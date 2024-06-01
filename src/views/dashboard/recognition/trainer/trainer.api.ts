import { fetchApi } from "../../../../helpers/apiquery";
import { evaluationtype } from "./trainertypes";

const baseqry: string = import.meta.env.VITE_NODE_BASE_URL;

export const GetCurrentModel = async (
  token: string,
  type: "Audio" | "Image"
) => {
  try {
    const data = await fetchApi<evaluationtype>(
      `${baseqry}/modeleval/current/${type}`,
      "GET",
      {
        Authorization: "Bearer " + token,
      }
    );
    return data.data;
  } catch (error) {
    return {} as evaluationtype;
  }
};
