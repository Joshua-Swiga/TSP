import TemplateSidebarContent from './template-sidebar-content';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';

export default function TemplateSidebar() {
    // Use the app's Sidebar UI so it responds to SidebarProvider state (toggle/collapse)
    return (
        <Sidebar collapsible="icon" variant="inset" className="shadow-sm ring-1 ring-black/5 bg-background-light dark:bg-background-dark">
            <SidebarContent className="p-2">
                <TemplateSidebarContent />
            </SidebarContent>
        </Sidebar>
    );
}
