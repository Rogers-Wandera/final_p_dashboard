import { fetchApi } from "../../../../../helpers/apiquery";
import { persontype } from "../person";
import { audioreturntype } from "./audiorecorder";
import { personaudiotype } from "./personaudio";
import { personimagestypes } from "./personimages";

const baseqry: string = import.meta.env.VITE_NODE_BASE_URL;

export const ViewSinglePerson = async (personId: string, token: string) => {
  try {
    const person = await fetchApi<persontype>(
      `${baseqry}/person/${personId}`,
      "GET",
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return person.data;
  } catch (error) {
    return {} as persontype;
  }
};

export const ViewPersonImages = async (personId: string, token: string) => {
  try {
    const images = await fetchApi<personimagestypes[]>(
      `${baseqry}/person/images/${personId}`,
      "GET",
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return images.data;
  } catch (error) {
    return [] as personimagestypes[];
  }
};

export const ViewPersonAudios = async (personId: string, token: string) => {
  try {
    const images = await fetchApi<personaudiotype[]>(
      `${baseqry}/person/audio/cloudaudio/${personId}`,
      "GET",
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return images.data;
  } catch (error) {
    return [] as personaudiotype[];
  }
};

export const GetAudioFile = async ({
  personId,
  token,
}: {
  personId: string;
  token: string;
}) => {
  try {
    const response = await fetchApi<audioreturntype>(
      `${baseqry}/person/audio/${personId}`,
      "GET",
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    return {} as audioreturntype;
  }
};
