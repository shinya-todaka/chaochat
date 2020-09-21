import { Decoded } from 'utils/Converter';

export type ORoom = {
  name: string | null;
  members: string[];
  expiresIn: 3 | 5 | 10 | 15;
  isClosed: boolean;
};

export type IRoom = Decoded<ORoom>;
