import { IMember } from 'models/member';

type OthersMessage = {
  id: string;
  sender: IMember;
  text: string;
  createdAt: Date | null;
};

export default OthersMessage;
