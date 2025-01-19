import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import logo from "../assets/fire.png";
import xmaslogo from "../assets/xmasfire.png";
import { useNavigate } from "react-router-dom";
import config from '../utils/config.js';

export const LoginPage = () => {
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [notification, setNotification] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        window.location.href = `${config.URL}/auth/discord`;
    };

    const handleLogout = async () => {
        const response = await fetch(`${config.URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            setUser(null);
            setNotification("Pomyślnie wylogowano!");
            setTimeout(() => setNotification(""), 3000);
            window.location.href = "/";
        } else {
            console.error("Error logging out:", response.statusText);
        }
    };

    // Funkcja do sprawdzenia, czy użytkownik jest zalogowany
    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch(`${config.URL}/api/user`, {
                credentials: 'include'
            });

            if (!response.ok) {
                console.error("Error fetching user data:", response.statusText);
                return;
            }

            const userData = await response.json();
            setUser(userData.user);
        };
        if (notification) {
            const timer = setTimeout(() => setNotification(''), 3000);
            return () => clearTimeout(timer);
        }

        fetchUserData();
    }, [notification]);

    return (
        <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gray-800">
            <div className="flex flex-col items-center bg-gray-900 p-6 rounded-lg shadow-lg w-[400px] h-[300px]">
                <img src={xmaslogo} alt="Christmas logo" className="mb-4" />
                <h2 className="text-2xl font-semibold mb-4 text-white">Zaloguj się</h2>
                <button
                    onClick={handleLogin}
                    className="flex items-center bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 transition-colors"
                >
                    <FontAwesomeIcon icon={faDiscord} className="mr-2 text-xl" />
                    Zaloguj przez Discord
                </button>

            </div>
        </div>
    );
};