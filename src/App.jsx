import {Router} from "./components/Routes/Router.jsx";
import {useState, useEffect} from "react";
import UserMenu from "./components/UserMenu.jsx";
import {UserProvider} from "./context/UserContext.jsx";
import config from "../src/utils/config.js";

function App() {
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState("");

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

    const handleLogout = async () => {
        const response = await fetch(`${config.URL}/auth/logout`, {
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
        <UserProvider>
            <div className="flex bg-gray-800 relative min-h-screen">
                <UserMenu user={user} logout={handleLogout}/>
                <Router/>
            </div>
        </UserProvider>
    );
}

export default App;
