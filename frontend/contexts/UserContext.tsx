import { User } from 'models/user';
import { FC, createContext, useContext } from 'react';
import useAuth from 'hooks/use-auth';

type UserContextValue = {
  user: User | null;
  loadingUser: boolean;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  loadingUser: true,
});

const UserProvier: FC = ({ children }) => {
  const [user, loadingUser] = useAuth();

  return (
    <UserContext.Provider value={{ user, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvier;
