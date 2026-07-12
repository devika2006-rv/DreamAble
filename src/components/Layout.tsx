import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <div className="app-shell">
    <header className="topbar">
      <div>
        <p className="eyebrow">DreamAble</p>
        <h1>Because Dreams Shouldn't Have Barriers.</h1>
      </div>
      <button className="ghost-btn">Journey Companion</button>
    </header>
    {children}
  </div>
);
