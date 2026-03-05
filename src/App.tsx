import { useState } from 'react';
import { DesktopProvider } from './context/DesktopContext';
import { Desktop } from './components/Desktop/Desktop';
import { LoginScreen } from './components/LoginScreen/LoginScreen';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <DesktopProvider>
      <Desktop onSignOut={() => setLoggedIn(false)} />
    </DesktopProvider>
  );
}

export default App;
