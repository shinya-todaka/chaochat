import AppBar from 'components/common/header/AppBar';
import Box from '@material-ui/core/Box';
import { useUser } from 'contexts/UserContext';
import { Switch, Route } from 'react-router-dom';

const Home = () => {
  return <>Home</>;
};

const Room = () => {
  return <>Room</>;
};

const App = () => {
  const { user, loadingUser } = useUser();

  return (
    <>
      <AppBar loadingUser={loadingUser} user={user} />
      <Box>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/room" component={Room} />
        </Switch>
      </Box>
    </>
  );
};

export default App;
