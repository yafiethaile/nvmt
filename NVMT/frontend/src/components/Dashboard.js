import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
  
    navigate('/', { state: { message: 'Logout successful' } }); 
  };

  return (
    <div className="dashboardContainer">
      <div className="menuIcon" onClick={toggleSidebar}>
        &#9776;
      </div>
      
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <Link to="/inventory" onClick={() => setIsSidebarOpen(false)}>Inventory</Link>
        <Link to="/suppliers" onClick={() => setIsSidebarOpen(false)}>Suppliers</Link>
        <Link to="/orders" onClick={() => setIsSidebarOpen(false)}>Orders & Purchases</Link>
        <button onClick={handleLogout}>Logout</button> {}
      </div>

      <div className="content">
        {}
      </div>
    </div>
  );
};

export default Dashboard;
