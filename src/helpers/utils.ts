import { EnqueueSnackbar } from "notistack";
import { SharedStateContextType } from "../contexts/sharedcontexts";
import { ErrorResponse, ModulesType } from "../store/services/auth";
import Crypto from "crypto-js";
import axios, { AxiosRequestConfig } from "axios";
import { useLocation, useParams } from "react-router-dom";

const baseqry: string = import.meta.env.VITE_NODE_BASE_URL;

export const handleError = (
  error: any,
  appstate: SharedStateContextType | null,
  enqueueSnackbar: EnqueueSnackbar
) => {
  const action = appstate?.action;
  if ("errors" in error) {
    const errors = error.errors as ErrorResponse[];
    errors.forEach((err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
        action: action,
        anchorOrigin: { horizontal: "right", vertical: "top" },
        hideIconVariant: true,
      });
    });
  } else {
    if ("msg" in error) {
      const msg = error.msg as string;
      enqueueSnackbar(msg, {
        variant: "error",
        action: action,
        anchorOrigin: { horizontal: "right", vertical: "top" },
        hideIconVariant: true,
      });
    } else {
      let msgerr: string;
      if ("error" in error) {
        msgerr = error.error;
      } else if ("message" in error) {
        msgerr = error.message;
      } else {
        msgerr = "Something went wrong";
      }
      enqueueSnackbar(msgerr, {
        variant: "error",
        action: action,
        anchorOrigin: { horizontal: "right", vertical: "top" },
        hideIconVariant: true,
      });
    }
  }

  if ("response" in error) {
    const res = error.response;
    if ("data" in res) {
      const data = res.data;
      if ("error" in data) {
        const msg = data.error;
        enqueueSnackbar(msg, {
          variant: "error",
          action: action,
          anchorOrigin: { horizontal: "right", vertical: "top" },
          hideIconVariant: true,
        });
      } else {
        if ("msg" in data) {
          const msg = data.msg;
          enqueueSnackbar(msg, {
            variant: "error",
            action: action,
            anchorOrigin: { horizontal: "right", vertical: "top" },
            hideIconVariant: true,
          });
        } else if ("message" in data) {
          const msg = data.message;
          enqueueSnackbar(msg, {
            variant: "error",
            action: action,
            anchorOrigin: { horizontal: "right", vertical: "top" },
            hideIconVariant: true,
          });
        } else {
          enqueueSnackbar("Something went wrong", {
            variant: "error",
            action: action,
            anchorOrigin: { horizontal: "right", vertical: "top" },
            hideIconVariant: true,
          });
        }
      }
    }
  }
};

export const encrypt = (input: string) => {
  const secretKey = import.meta.env.VITE_EN_SECRET_KEY;
  const cipherInput = Crypto.AES.encrypt(input, secretKey).toString();
  return cipherInput;
};

export const decrypt = (encrypted: string) => {
  const secretKey = import.meta.env.VITE_EN_SECRET_KEY;
  const bytes = Crypto.AES.decrypt(encrypted, secretKey);
  const ciphedInput = bytes.toString(Crypto.enc.Utf8);
  return ciphedInput;
};

export const encryptUrl = (input: string) => {
  const encrypted = encrypt(input);
  return encodeURIComponent(encrypted);
};

export const decryptUrl = (input: string) => {
  const secretKey = import.meta.env.VITE_EN_SECRET_KEY;
  const bytes = Crypto.AES.decrypt(decodeURIComponent(input), secretKey);
  const ciphedInput = bytes.toString(Crypto.enc.Utf8);
  return ciphedInput;
};

export const checkItemExists = (array1: any[], array2: any[]) => {
  return array1.some((item) => array2.includes(item));
};

// this returns the response with a generic T
export const FetchData = async <T>(
  url: string,
  headers?: AxiosRequestConfig["headers"]
): Promise<T> => {
  try {
    const response = await axios.get<T>(url, {
      headers: headers,
    });
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const handleAxiosError = (
  error: any,
  enqueueSnackbar: EnqueueSnackbar
) => {
  let msg = "";
  let status = 500;
  if (error?.response?.data?.msg) {
    msg = error?.response?.data?.msg;
  } else if (error?.response?.data?.error) {
    msg = error.response?.data?.error;
  } else {
    msg = error?.response?.data?.message;
  }
  if (error?.response?.status) {
    status = error?.response?.status;
  }
  enqueueSnackbar(`${status} ${msg}`, {
    variant: "error",
    anchorOrigin: { horizontal: "right", vertical: "top" },
  });
};

export const useBasePath = () => {
  const location = useLocation();
  const params = useParams<Record<string, string>>();
  return Object.keys(params).reduce((path, param) => {
    const decodedpath = decodeURIComponent(path);
    const replaced = decodedpath.replace("/" + params[param], "");
    return replaced;
  }, location.pathname);
};

export const GetUserLinks = async (token: string): Promise<ModulesType> => {
  try {
    const url = `${baseqry}/modules/linkroles/user/view`;
    const data = await FetchData<ModulesType>(url, {
      Authorization: "Bearer " + token,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
