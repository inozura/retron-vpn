import { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import SignIn from './SignIn';
import Home from './Home';
import Start from './Start';
import About from './About';
import ForgetPass from './ForgetPass';
import SignUp from './SignUp';
import Connecting from './Connecting';
import Connected from './Connected';
import Rating from './Rating';
import Support from './Support';
import Servers from './Servers';
import Option from './Option';
import { PrivateRoute, ProvideAuth } from './contexts/AuthContext';
import './App.css';

export default function App() {
  const history = useHistory();
  const [selectedServer, setSelectedServer] = useState({});
  const [connectedServer, setConnectedServer] = useState({});
  const [platformId, setPlatformId] = useState(0);
  const [protocolId, setProtocolId] = useState(0);

  useEffect(() => {
    const showOption = (arg) => {
      if (arg === 'show') {
        history.push('/option');
      }
    };
    window.electron.ipcRenderer.on('option-window', showOption);

    return () => {
      window.electron.ipcRenderer.removeListener('option-window', showOption);
    };
  }, []);

  return (
    <ProvideAuth>
      <Switch>
        <Route exact path="/">
          <Start />
        </Route>
        <PrivateRoute path="/option">
          <Option />
        </PrivateRoute>
        <PrivateRoute path="/home">
          <Home
            selectedServer={selectedServer}
            connectedServer={connectedServer}
          />
        </PrivateRoute>
        <Route path="/sign-in">
          <SignIn />
        </Route>
        <PrivateRoute path="/about">
          <About />
        </PrivateRoute>
        <Route path="/forget-password">
          <ForgetPass />
        </Route>
        <Route path="/sign-up">
          <SignUp />
        </Route>
        <PrivateRoute path="/connecting">
          <Connecting
            selectedServer={selectedServer}
            connectedServer={connectedServer}
            platformId={platformId}
            protocolId={protocolId}
            setConnectedServer={setConnectedServer}
            setPlatformId={setPlatformId}
            setProtocolId={setProtocolId}
          />
        </PrivateRoute>
        <PrivateRoute path="/connected">
          <Connected
            selectedServer={selectedServer}
            connectedServer={connectedServer}
            platformId={platformId}
            protocolId={protocolId}
          />
        </PrivateRoute>
        <PrivateRoute path="/rating">
          <Rating
            selectedServer={selectedServer}
            connectedServer={connectedServer}
            setConnectedServer={setConnectedServer}
            platformId={platformId}
            protocolId={protocolId}
          />
        </PrivateRoute>
        <PrivateRoute path="/support">
          <Support />
        </PrivateRoute>
        <PrivateRoute path="/servers">
          <Servers
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
          />
        </PrivateRoute>
      </Switch>
    </ProvideAuth>
  );
}
