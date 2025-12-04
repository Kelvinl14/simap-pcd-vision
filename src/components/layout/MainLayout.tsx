import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <AppSidebar />
      <AppHeader />

      <main
        id="main-content"
        className="ml-64 pt-16 transition-all duration-300"
        role="main"
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
