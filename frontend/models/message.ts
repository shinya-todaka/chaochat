import { Decoded } from 'utils/Converter';

export type OMessage = {
  from: string;
  text: string;
};

export type IMessage = Decoded<OMessage>;
