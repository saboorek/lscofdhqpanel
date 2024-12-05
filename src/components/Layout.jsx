import {Sidebar} from './Sidebar/Sidebar.jsx';
import PropTypes from "prop-types";

export function Layout({children}) {
    return (
        <div className="flex min-h-screen h-screen w-full">
            <div className="flex">
                <Sidebar/>
            </div>
            <div className="flex-1 flex items-center justify-center p-6 w-full">
                {children}
            </div>
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};