import {
    faHome,
    faFile,
    faFileInvoiceDollar,
    faFileLines,
    faCommentsDollar,
    faBuilding,

} from "@fortawesome/free-solid-svg-icons";

export const sidebarItems = [
    {type: "item", href: "/dashboard", icon: faHome, label: "Dashboard"},
    {type: "title", title: "Panel Administracyjny", roles: ["ADMINISTRATOR"]},
    {type: "item", href: "/manage-parameters", icon: faFile, label: "Zarządzanie parametrami", roles: ["ADMINISTRATOR"]},
    {type: "title", title: "Panel Supervisory", roles: ["SV", "ADMINISTRATOR"]},
    {type: "item", href: "#", icon: faFile, label: "Raporty z kontroli", roles: ["FPD SUPERVISOR", "ADMINISTRATOR"]},
    {type: "item", href: "#", icon: faFileInvoiceDollar, label: "Cytacje", roles: ["FPD SUPERVISOR", "ADMINISTRATOR"]},
    {type: "title", title: "Fire Prevention Division", roles: ['FPD INSPECTOR', "ADMINISTRATOR"]},
    {type: "item", href: "/citation-table", icon: faCommentsDollar, label: "Tabela cytacji", roles: ['FPD INSPECTOR', "ADMINISTRATOR"]},
    {type: "item", href: "/businesses", icon: faBuilding, label: "Biznesy", roles: ['FPD INSPECTOR', "ADMINISTRATOR"]},
    {type: "title", title: "Professional Performance", roles: ['FPD INSPECTOR', "ADMINISTRATOR"]},
    {type: "item", href: "/#", icon: faFileLines, label: "Teczki pracowników", roles: ['FPD INSPECTOR', "ADMINISTRATOR"]},
    {type: "title", title:"Panel ticketów", roles: ["ADMINISTRATOR"]},
    {type: "items", href:"#", icon: faFileLines, label: "Transkrypty", roles: ["ADMINISTRATOR"]},

];
