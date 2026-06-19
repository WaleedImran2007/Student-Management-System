import { Outlet } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';

import './css/common.css';
import './css/responsive.css';

function App() {
  return <>

    <div className="outermost-container">
      <Sidebar />

      <div className="right-side">
        <TopBar />

        <Outlet />

      </div>
    </div>

    <Footer />

  </>
}

export default App;
