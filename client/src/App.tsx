/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - MAIN APP ROOT
 * ============================================================================
 * Hosts the global AuthProvider and AppRoutes
 * ============================================================================
 */

import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import './index.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
