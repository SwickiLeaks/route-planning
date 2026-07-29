import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from '@/components/Dashboard';
import MsnSvrDebugPage from '@/components/debug/MsnSvrDebugPage';
import { theme } from '@/theme';

// Root component wiring up the theme and dashboard (or the ?debug page).
const App = () => {
  const debug = new URLSearchParams(window.location.search).has('debug');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {debug ? <MsnSvrDebugPage /> : <Dashboard />}
    </ThemeProvider>
  );
};

export default App;
