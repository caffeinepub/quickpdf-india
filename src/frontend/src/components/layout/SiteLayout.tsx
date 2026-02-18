import { Outlet } from '@tanstack/react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AdSlot } from '../ads/AdSlot';

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AdSlot variant="header-banner" className="mt-16" />
      <div className="flex flex-1">
        <aside className="hidden lg:block lg:w-64 xl:w-72">
          <div className="sticky top-20 p-4">
            <AdSlot variant="sidebar" />
          </div>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
