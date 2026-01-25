import { useState } from "react";
import Navigation from "./Components/layout/NavigationNew";
import TopBar from "./Components/layout/TopBar";
import { useLocation } from "react-router-dom";
// Ray v10.0 OMEGA - World's Most Advanced NBA Analytics Chatbot
import RayAssistant from "./Components/ray/RayAssistantOmega";

export default function Layout({ children, currentPageName }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rayOpen, setRayOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Sidebar */}
      <Navigation 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Top Bar */}
      <TopBar collapsed={sidebarCollapsed} />
      
      {/* Main Content */}
      <main 
        className={`relative transition-all duration-300 pt-16 min-h-screen ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'
        }`}
      >
        {children}
      </main>
      
      {/* Ray Assistant */}
      <RayAssistant 
        isOpen={rayOpen} 
        onClose={() => setRayOpen(false)}
        onToggle={() => setRayOpen(!rayOpen)}
      />
    </div>
  );
}