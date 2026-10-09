/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - MAIN APP ROOT
 * ============================================================================
 * Hosts the global AuthProvider, AppRoutes, and global ambient animations
 * ============================================================================
 */

import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import './index.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      {/* Global Ambient Aurora Orbs - rendered behind all content */}
      <div className="aurora-orb-1" aria-hidden="true" />
      <div className="aurora-orb-2" aria-hidden="true" />
      <div className="aurora-orb-3" aria-hidden="true" />

      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

