import { sidebarItems } from "./SidebarData.jsx";
import SidebarItem from "./SidebarItem.jsx";
import SidebarSectionTitle from "./SidebarSectionTitle.jsx";
import logo from "../../assets/fire.png";
import xmaslogo from "../../assets/xmasfire.png";
import { useUser } from "../../context/UserContext.jsx";

export const Sidebar = () => {
    const { user } = useUser();

    // Filtruj elementy na podstawie ról użytkownika
    const filteredItems = sidebarItems.filter(item => {
        // Jeśli brak wymagań co do ról, wyświetl element
        if (!item.roles) return true;
        // Jeśli użytkownik ma wymagane role, wyświetl element
        return item.roles.some(role => user?.roles?.includes(role));
    });

    return (
        <div className="fixed-sidebar bg-gray-900 text-white flex flex-col h-full w-64 max-w-xs">
            <div className="flex items-center justify-center py-4">
                <img src={xmaslogo} alt="logo" className="h-20" />
            </div>
            <ul className="space-y-2 flex-grow">
                {filteredItems.map((item, index) =>
                    item.type === "title" ? (
                        <SidebarSectionTitle key={index} title={item.title} />
                    ) : (
                        <SidebarItem key={index} {...item} />
                    )
                )}
            </ul>
            <footer className="py-4 text-center text-xs text-gray-600 px-4 break-words overflow-wrap break-word">
                <p>
                    © 2024 A site created for a LSCoFD faction running on the Vibe Roleplay server. All rights reserved.
                </p>
                <p>Author: Saboorek</p>
            </footer>
        </div>
    );
};
