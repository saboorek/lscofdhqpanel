import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Layout} from "../Layout.jsx";
import {Home} from "../../Pages/Home.jsx";
import {LoginPage} from "../../Pages/LoginPage.jsx";
import { CitationTable } from "../../Pages/citationTable.jsx";
import { BusinessList } from '../../Pages/Business/BusinessList.jsx';
import { BusinessDetails } from '../../Pages/Business/BusinessDetails.jsx';
import { ManageParameters } from '../../Pages/ManageParameters.jsx';


export function Router() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/dashboard" element={<Home/>}/>
                    <Route path="/citationTable" element={<CitationTable/>}/>
                    <Route path="/businesses" element={<BusinessList/>}/>
                    <Route path="/businesses/:id" element={<BusinessDetails/>}/>
                    <Route path="/manageParameters" element={<ManageParameters />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}