import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Importuj useNavigate

const UserMenu = ({ user, logout }) => {
    const avatarUrl = user && user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : null;

    if (!user) {
        return null;
    }

    const sortedRoles = user.guildRoles.sort((a, b) => {
        const priority = { ADMINISTRATOR: 100 };
        const priorityA = priority[a] || 0;
        const priorityB = priority[b] || 0;

        return priorityB - priorityA;
    });
    const topRole = sortedRoles.length > 0 ? sortedRoles[0] : "Brak roli";

    const handleLogout = async () => {
        // Wywołanie funkcji logout (np. usunięcie sesji)
        await logout();

        // Po wylogowaniu przekieruj na stronę logowania
        window.location.href = "/login";
    };

    return (
        <div className="absolute top-4 right-4">
            <Menu as="div" className="relative">
                <Menu.Button
                    className="flex items-center bg-gray-900 p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="flex flex-col items-start w-28">
                        <span className="text-white font-medium truncate text-center">{user.username}</span>
                        <span className="text-gray-400 text-xs truncate">{topRole}</span>
                    </div>
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleLogout} // Wywołanie handleLogout
                                        className={`${
                                            active ? "bg-red-600" : "bg-gray-900"
                                        } text-white block px-4 py-2 text-sm w-full text-left flex justify-between items-center`}
                                    >
                                        <span>Wyloguj się</span>
                                        <FontAwesomeIcon
                                            icon={faSignOutAlt}
                                            className="ml-auto"
                                        />
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default UserMenu;
