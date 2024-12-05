import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

const SidebarItem = ({ href, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === href;

    return (
        <li className="relative">
            <a
                href={href}
                className={`flex items-center p-2 rounded-lg border-gray-600 relative z-10 hover:bg-gray-700${
                    isActive ? "bg-red-700 text-white" : ""
                }`}
            >
                <FontAwesomeIcon icon={icon} className={`mr-3 ${isActive ? "text-white" : ""}`} />
                {label}
            </a>
            <div
                className={`absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-gray-500 group-hover:bg-gray-500 z-0 ${
                    isActive ? "border-red-500 bg-red-500" : ""
                }`}
            ></div>
        </li>
    );
};

SidebarItem.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
};

export default SidebarItem;
