import {
    faHome,
    faFile,
    faFileInvoiceDollar,
    faFileLines,
    faCommentsDollar,
    faBuilding,

} from "@fortawesome/free-solid-svg-icons";

export const sidebarItems = [
    {type: "item", href: "/", icon: faHome, label: "Dashboard"},
    {type: "title", title: "Panel Administracyjny"},
    {type: "item", href: "/manageParameters", icon: faFile, label: "Zarządzanie parametrami"},
    {type: "title", title: "Panel Supervisory"},
    {type: "item", href: "#", icon: faFile, label: "Raporty z kontroli"},
    {type: "item", href: "#", icon: faFileInvoiceDollar, label: "Cytacje"},
    {type: "title", title: "Panel Inspektora"},
    {type: "item", href: "/citationTable", icon: faCommentsDollar, label: "Tabela cytacji"},
    {type: "item", href: "/businesses", icon: faBuilding, label: "Biznesy"},
    {type: "title", title:"Panel ticketów"},
    {type: "items", href:"#", icon: faFileLines, label: "Transkrypty"},

];
