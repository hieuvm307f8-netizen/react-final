import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarComponent } from "./sidebar/SidebarComponent"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarComponent />
        <main className="flex-1 overflow-y-auto p-0">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}