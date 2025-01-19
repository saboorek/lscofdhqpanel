import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../Layout.jsx";
import { ProtectedRoute } from "../ProtectedRoute.jsx";
import { Home } from "../../Pages/Home.jsx";
import { LoginPage } from "../../Pages/LoginPage.jsx";
import { CitationTable } from "../../Pages/citationTable.jsx";
import { BusinessList } from '../../Pages/Business/BusinessList.jsx';
import { BusinessDetails } from '../../Pages/Business/BusinessDetails.jsx';
import { ManageParameters } from '../../Pages/ManageParameters.jsx'
import { Unauthorized } from "../../Pages/Unauthorized.jsx";
import { useUser } from "../../context/UserContext.jsx"; // Używamy hooka do sprawdzania, czy użytkownik jest zalogowany

export function Router() {
    const { user, loading } = useUser(); // Pobieramy dane użytkownika z kontekstu

    if (loading) {
        return <div>Loading...</div>; // Można dodać loading spinner lub inne wskazanie ładowania
    }

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Jeśli użytkownik nie jest zalogowany, przekierowujemy go na stronę logowania */}
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

                    <Route path="/login" element={<LoginPage />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute requiredRoles={["LSCOFD"]}>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/citation-table"
                        element={
                            <ProtectedRoute requiredRoles={["FPD INSPECTOR"]}>
                                <CitationTable />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/businesses"
                        element={
                            <ProtectedRoute requiredRoles={["FPD INSPECTOR"]}>
                                <BusinessList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/businesses/:id"
                        element={
                            <ProtectedRoute requiredRoles={["FPD INSPECTOR"]}>
                                <BusinessDetails />
                            </ProtectedRoute>
                    }
                    />
                    <Route
                        path="/manage-parameters"
                        element={
                            <ProtectedRoute requiredRoles={["ADMINISTRATOR"]}>
                                <ManageParameters />
                            </ProtectedRoute>
                    }
                    />
                    <Route
                        path="/unauthorized"
                        element={
                        <Unauthorized />
                    }
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
