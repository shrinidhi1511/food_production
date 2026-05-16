import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f7]">
      <Sidebar />
      <main className="flex-1 ml-[280px] min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
