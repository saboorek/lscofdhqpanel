import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import config from '../../utils/config.js';
import { Dialog } from "@headlessui/react";

export const BusinessList = () => {
    const [businesses, setBusinesses] = useState([]);
    const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
    const [reports, setReports] = useState({});
    const [name, setName] = useState('');
    const [owner, setOwner] = useState('');
    const [address, setAddress] = useState('');
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    const [currentBusinessPage, setCurrentBusinessPage] = useState(1);
    const businessPerPage = 15;

    const totalPages = Math.ceil(businesses.length / businessPerPage);

    const handlePageChangeBusinesses = (pageNumber) => {
        setCurrentBusinessPage(pageNumber);
    };

    const handleRowClick = (businessId) => {
        navigate(`/businesses/${businessId}`);
    };

    useEffect(() => {
        axios.get(`${config.URL}/api/businesses`)
            .then(response => {
                const businessesData = response.data;
                setBusinesses(businessesData);

                const reportsPromises = businessesData.map(business =>
                    axios.get(`${config.URL}/api/businesses/${business._id}/reports`)
                        .then(reportResponse => ({
                            businessId: business._id,
                            reports: reportResponse.data
                        }))
                );

                Promise.all(reportsPromises)
                    .then(results => {
                        const reportsData = {};
                        results.forEach(result => {
                            reportsData[result.businessId] = result.reports;
                        });
                        setReports(reportsData);
                    })
                    .catch(error => console.error('Błąd przy pobieraniu raportów:', error));
            })
            .catch(error => console.error('Błąd przy pobieraniu biznesów:', error));
    }, []);

    const handleAddBusiness = (e) => {
        e.preventDefault();

        const newBusiness = { name, owner, address, url };

        axios.post(`${config.URL}/api/businesses`, newBusiness)
            .then(response => {
                setBusinesses([...businesses, response.data]);
                setName('');
                setOwner('');
                setAddress('');
                setUrl('');
            })
            .catch(error => console.error('Błąd przy dodawaniu biznesu:', error));
    };

    const openForm = () => setIsAddBusinessModalOpen(true);
    const closeForm = () => setIsAddBusinessModalOpen(false);

    const calculateDaysToNextControl = (lastReportDate) => {
        const nextControlDate = new Date(lastReportDate);
        const daysToAdd = controlPassed === false ? 7 : 60;
        nextControlDate.setDate(nextControlDate.getDate() + daysToAdd);

        const today = new Date();
        const timeDifference = nextControlDate - today;

        const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

        return daysLeft >= 0 ? daysLeft : -1;
    };

    const sortedBusinesses = businesses.map(business => {
        const businessReports = reports[business._id] || [];
        const lastReport = businessReports.length > 0 ? businessReports[0] : null;

        const controlPassed = lastReport ? lastReport.controlPassed : true;

        const daysToNextControl = lastReport ? calculateDaysToNextControl(lastReport.controlDate, controlPassed) : -1;

        return { ...business, daysToNextControl };
    }).sort((a, b) => a.daysToNextControl - b.daysToNextControl);

    const currentBusiness = sortedBusinesses.slice(
        (currentBusinessPage - 1) * businessPerPage,
        currentBusinessPage * businessPerPage
    );

    const formatDaysText = (days) => {
        if (days === 1) {
            return "1 dzień";
        } else if (days > 1) {
            return `${days} dni`;
        } else {
            return "Kontrola minęła";
        }
    };

    return (
        <div className="p-6 bg-gray-800 text-white min-h-screen">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Lista biznesów:</h1>
                <div className="flex justify-center space-x-2 border-2 rounded-lg w-[60px] border-gray-600 bg-gray-600 relative">
                    <div className="relative group">
                        <button onClick={openForm} className="bg-green-500 p-2 rounded-full hover:bg-green-700">
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 top-12 w-max p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Dodaj raport
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg w-full">
                {businesses.length === 0 ? (
                    <p>Brak biznesów w systemie.</p>
                ) : (
                    <>
                        <table className="min-w-full table-auto">
                            <thead>
                            <tr className="border-b border-gray-600">
                                <th className="py-2 px-4 text-left">Nazwa</th>
                                <th className="py-2 px-4 text-left">Data ostatniej kontroli</th>
                                <th className="py-2 px-4 text-left">Czas do następnej kontroli</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentBusiness.map((business) => {
                                const businessReports = reports[business._id] || [];
                                const lastReport = businessReports.length > 0 ? businessReports[0] : null;
                                const lastReportDate = lastReport ? new Date(lastReport.controlDate).toLocaleDateString() : 'Brak raportu';
                                const controlPassed = lastReport ? lastReport.controlPassed : null;
                                let daysToNextControl;
                                if (controlPassed === null) {
                                    daysToNextControl = 'Brak raportu';
                                } else {
                                    daysToNextControl = calculateDaysToNextControl(lastReport.controlDate, controlPassed);
                                }
                                return (
                                    <tr key={business._id}
                                        className={`border-b border-gray-600 hover:bg-gray-700 cursor-pointer ${typeof daysToNextControl === 'number' && daysToNextControl <= 7 ? 'bg-red-800 hover:bg-red-700' : typeof daysToNextControl === 'number' && daysToNextControl <= 14 ? 'bg-yellow-700 hover:bg-yellow-600' : ''}`}
                                        onClick={() => handleRowClick(business._id)}
                                    >
                                        <td className="py-2 px-4">{business.name}</td>
                                        <td className="py-2 px-4">{lastReportDate}</td>
                                        <td className="py-2 px-4">
                                            {typeof daysToNextControl === 'number' ? formatDaysText(daysToNextControl) : daysToNextControl}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {/* Paginacja */}
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => handlePageChangeBusinesses(currentBusinessPage - 1)}
                                disabled={currentBusinessPage === 1}
                                className="p-2 bg-gray-700 rounded-l-md hover:bg-gray-600 disabled:opacity-50"
                            >
                                Poprzednia
                            </button>
                            <span className="p-2 bg-gray-700">{currentBusinessPage} / {totalPages}</span>
                            <button
                                onClick={() => handlePageChangeBusinesses(currentBusinessPage + 1)}
                                disabled={currentBusinessPage === totalPages}
                                className="p-2 bg-gray-700 rounded-r-md hover:bg-gray-600 disabled:opacity-50"
                            >
                                Następna
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal dla nowego biznesu */}
            {isAddBusinessModalOpen && (
                <Dialog open={isAddBusinessModalOpen} onClose={closeForm}>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-white">
                        <Dialog.Panel className="bg-gray-900 p-6 rounded-lg w-[500px] max-h-[80vh] overflow-auto">
                            <h2 className="text-lg font-bold mb-2">Dodaj biznes</h2>
                            {/* Formularz dodawania biznesu */}
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nazwa biznesu"
                                className="w-full bg-gray-800 text-white p-2 rounded mt-4"
                            />
                            <input
                                value={owner}
                                onChange={(e) => setOwner(e.target.value)}
                                placeholder="Właściciel biznesu"
                                className="w-full bg-gray-800 text-white p-2 rounded mt-4"
                            />
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Adres biznesu"
                                className="w-full bg-gray-800 text-white p-2 rounded mt-4"
                            />
                            <input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="URL biznesu"
                                className="w-full bg-gray-800 text-white p-2 rounded mt-4"
                            />
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={handleAddBusiness}
                                    className="bg-blue-500 p-2 rounded-full hover:bg-blue-700"
                                >
                                    Dodaj biznes
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </div>
    );
};