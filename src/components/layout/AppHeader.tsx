import { Bell, HelpCircle, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  sidebarCollapsed?: boolean;
}

export function AppHeader({ sidebarCollapsed = false }: AppHeaderProps) {
  return (
    <header
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-6 transition-all duration-300"
      style={{
        left: sidebarCollapsed ? "4.5rem" : "16rem",
      }}
      role="banner"
    >
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Secretaria Municipal</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-sm font-medium">SIMAP-PCD</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Ajuda"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notificações (3 novas)"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-destructive p-0 text-xs text-destructive-foreground">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="ml-2 flex items-center gap-3 px-2 hover:bg-muted"
              aria-label="Menu do usuário"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  MS
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">Maria Silva</p>
                <p className="text-xs text-muted-foreground">Coordenadora</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
