import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Layout} from "../Layout.jsx";
import { ProtectedRoute } from "../ProtectedRoute.jsx";
import {Home} from "../../Pages/Home.jsx";
import {LoginPage} from "../../Pages/LoginPage.jsx";
import { CitationTable } from "../../Pages/citationTable.jsx";
import { BusinessList } from '../../Pages/Business/BusinessList.jsx';
import { BusinessDetails } from '../../Pages/Business/BusinessDetails.jsx';
import { ManageParameters } from '../../Pages/ManageParameters.jsx'
import { Unauthorized } from "../../Pages/Unauthorized.jsx";


export function Router() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/dashboard" element={<Home/>}/>
                    <Route
                        path="/citationTable"
                        element={
                            <ProtectedRoute requiredRoles={["FPD INSPECTOR"]}>
                                <CitationTable />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/businesses" element={<BusinessList/>}/>
                    <Route path="/businesses/:id" element={<BusinessDetails/>}/>
                    <Route path="/manageParameters" element={<ManageParameters />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}