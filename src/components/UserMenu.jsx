// UserMenu.jsx
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const UserMenu = ({ user, logout }) => {
    const avatarUrl = user && user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : null;

    if (!user) {
        return null;
    }

    return (
        <div className="absolute top-4 right-4">
            <Menu as="div" className="relative">
                <Menu.Button className="flex items-center bg-gray-900 p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-white">{user.username}</span>
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
                                        onClick={logout}
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
