import { Decoded } from 'utils/Converter';

export type OMember = {
  displayName: string;
  photoURL: string | null;
  isEnabled: boolean;
};

export type IMember = Decoded<OMember>;
