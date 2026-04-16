import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Bell, User } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const Layout = ({ title }) => {
  const [userName, setUserName] = useState('Landlord');

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.name) {
        setUserName(user.name);
      }
    } catch(e) {}
  }, []);

  return (
    <div className="layout-container" style={{ display: 'flex', backgroundColor: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <Sidebar />
      <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* Top Header */}
        <header style={{ 
          height: '70px', 
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 2rem',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '600', m: 0 }}>{title || 'Dashboard'}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ position: 'relative', color: 'var(--text-secondary)' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{userName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Landlord</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
// import React, { useState, useEffect } from 'react';
// import Sidebar from './Sidebar';
// import { Bell, User } from 'lucide-react';
// import { Outlet } from 'react-router-dom';

// const Layout = ({ title }) => {
//   const [userName, setUserName] = useState('Landlord');

//   useEffect(() => {
//     try {
//       const user = JSON.parse(localStorage.getItem('user'));
//       if (user && user.name) {
//         setUserName(user.name);
//       }
//     } catch(e) {}
//   }, []);

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       <Sidebar />

//       <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
//         {/* Header */}
//         <header style={{ 
//           height: '70px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           padding: '0 20px'
//         }}>
//           <h2>{title || "Dashboard"}</h2>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <Bell />
//             <User />
//             <span>{userName}</span>
//           </div>
//         </header>

//         {/* Main content */}
//         <main style={{ padding: '20px' }}>
//           <Outlet />   {/* 🔥 THIS FIXES YOUR APP */}
//         </main>

//       </div>
//     </div>
//   );
// };

// export default Layout;