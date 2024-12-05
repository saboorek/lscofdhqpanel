import PropTypes from "prop-types";

const SidebarSectionTitle = ({title}) => {
    return (
        <li className="text-gray-500 text-center text-xl py-4">
            {title}
        </li>
    );
};

SidebarSectionTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

export default SidebarSectionTitle;
