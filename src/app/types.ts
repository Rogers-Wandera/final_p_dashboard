export type personmeta = {
  id: number;
  metaDesc: string;
  metaName: string;
  personId: string;
  isActive: number;
};

export type personimages = {
  id: number;
  imageUrl: string;
  personId: string;
  publicId: string;
  timestamp: string;
  userId: string;
  isActive: number;
};

export type personaudio = {
  id: number;
  audioUrl: string;
  personId: string;
  publicId: string;
  isActive: number;
};

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  status: string;
  gender: string;
  createdAt: string;
  createdBy: string;
  deleted_at: string;
  isActive: number;
};

export type recognizedperson = {
  id: number;
  modelType: string;
  personId: string;
  personName: string;
  ranking: number;
  type: string;
  userId: string;
  userName: string;
  confidence: number;
  classifierType: string;
  classifierId: number;
  status: string;
  match: 0 | 1;
  isActive: number;
  Person: Person;
  PersonImages: personimages[];
  PersonMeta: personmeta[];
  PersonAudios: personaudio[];
};
