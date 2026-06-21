import { Outlet } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import AIAssistant from './pages/AIAssistant';

import './css/common.css';
import './css/responsive.css';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return <>

    <div className="outermost-container">
      <Sidebar />

      <div className="right-side">
        <TopBar />

        <Outlet />

      </div>
    </div>

    <div className='ai-float-container'>
      <div className='ai-options'>
        <span>SMS Assistant 🤖</span>
        {
          isOpen ? <span className='ai-toggle' onClick={() => setIsOpen(false)}>X</span> : <span className='ai-toggle ai-open' onClick={() => setIsOpen(true)}>^</span>
        }
      </div>

      {
        isOpen && <div className='ai-interface'>
          <AIAssistant />
        </div>
      }

    </div>

    <Footer />

  </>
}

export default App;
