import { Router } from "./components/Routes/Router.jsx"; // Twoje obecne importy
import { useState, useEffect } from "react";
import UserMenu from "./components/UserMenu"; // Importujemy komponent UserMenu

function App() {
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState("");

    const fetchUserData = async () => {
        const response = await fetch('http://localhost:5000/api/user', {
            credentials: 'include'
        });

        if (!response.ok) {
            console.error("Error fetching user data:", response.statusText);
            return;
        }

        const userData = await response.json();
        setUser(userData.user);
    };

    const handleLogout = async () => {
        const response = await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            setUser(null);
            setNotification("Pomyślnie wylogowano!");
            setTimeout(() => setNotification(""), 3000);
        } else {
            console.error("Error logging out:", response.statusText);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="flex bg-gray-800 relative min-h-screen">
            <UserMenu user={user} logout={handleLogout} />
            <Router />
        </div>
    );
}

export default App;
