import { DesktopProvider } from './context/DesktopContext';
import { Desktop } from './components/Desktop/Desktop';

function App() {
  return (
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  );
}

export default App;
