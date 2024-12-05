import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faEdit, faTrash, faFileInvoiceDollar} from "@fortawesome/free-solid-svg-icons";
import {useParams, useNavigate} from "react-router-dom";
import axios from 'axios';
import {Dialog} from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const BusinessDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [notes, setNotes] = useState('');
    const [notification, setNotification] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    {/* Raporty */}
    const [reports, setReports] = useState([]);
    const [controlDate, setControlDate] = useState(new Date());
    const [inspector, setInspector] = useState('');
    const [controlPassed, setControlPassed] = useState(false);
    const [controlDescription, setControlDescription] = useState('');
    const [alarmService, setAlarmService] = useState(false);
    const [controlType, setControlType] = useState('Planowana');
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);

    {/* Cytacje */}
    const [citations, setCitations] = useState([]);
    const [citationDate, setCitationDate] = useState(new Date());
    const [citationAmount, setCitationAmount] = useState('');
    const [citationReason, setCitationReason] = useState('');
    const [selectedCitation, setSelectedCitation] = useState(null);
    const [isCitationModalOpen, setIsCitationModalOpen] = useState(false);
    const [isAddCitationModalOpen, setIsAddCitationModalOpen] = useState(false);


    const [currentReportPage, setCurrentReportPage] = useState(1);
    const reportsPerPage = 5;

    const [currentCitationPage, setCurrentCitationPage] = useState(1);
    const citationsPerPage = 5;

    useEffect(() => {
        if (business) {
            setIsDisabled(true);
        }
    }, [business]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/businesses/${id}`)
            .then(response => {
                setBusiness(response.data);
                setNotes(response.data.notes || '');
            })
            .catch(error => console.error('Błąd przy pobieraniu danych biznesu:', error));

        axios.get(`http://localhost:5000/api/businesses/${id}/reports`)
            .then(response => setReports(response.data))
            .catch(error => console.error('Błąd przy pobieraniu raportów:', error));

        axios.get(`http://localhost:5000/api/businesses/${id}/citations`)
            .then(response => setCitations(response.data))
            .catch(error => console.error('Błąd przy pobieraniu cytacji:', error));
    }, [id]);

    const indexOfLastReport = currentReportPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    const indexOfLastCitation = currentCitationPage * citationsPerPage;
    const indexOfFirstCitation = indexOfLastCitation - citationsPerPage;
    const currentCitations = citations.slice(indexOfFirstCitation, indexOfLastCitation);


    const totalPages = Math.ceil(reports.length / reportsPerPage);
    const totalPagesCitations = Math.ceil(citations.length / citationsPerPage);

    const handlePageChangeReports = (pageNumber) => {
        setCurrentReportPage(pageNumber);
    };

    const handlePageChangeCitations = (pageNumber) => {
        setCurrentCitationPage(pageNumber);
    };

    const handleUpdateNotes = () => {
        axios.put(`http://localhost:5000/api/businesses/${id}`, {notes})
            .then(() => {
                setNotification('Pomyślnie zaktualizowano notatkę!');
                setTimeout(() => setNotification(''), 3000);
            })
            .catch(error => console.error('Błąd przy aktualizacji notatek:', error));
    };

    const handleDeleteBusiness = () => {
        axios.delete(`http://localhost:5000/api/businesses/${id}`)
            .then(() => navigate('/businesses'))
            .catch(error => console.error('Błąd przy usuwaniu biznesu:', error));
    };

    const openEditPopup = () => {
        setCurrentBusiness(business);
        setEditMode(true);
    };

    const handleEditBusiness = () => {
        axios.put(`http://localhost:5000/api/businesses/${id}`, currentBusiness)
            .then(() => {
                setNotification('Pomyślnie zaktualizowano biznes!');
                setTimeout(() => setNotification(''), 3000);
                setEditMode(false);
            })
            .catch(error => console.error('Błąd przy edytowaniu biznesu:', error));
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCurrentBusiness(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const openCitation = () => setIsAddCitationModalOpen(true);
    const closeCitation = () => setIsAddCitationModalOpen(false);
    const openReport = () => setIsAddReportModalOpen(true);
    const closeReport = () => setIsAddReportModalOpen(false);

    const openReportModal = (report) => {
        setSelectedReport(report);
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setSelectedReport(null);
    };
    const openCitationModal = (citation) => {
        setSelectedCitation(citation);
        setIsCitationModalOpen(true);
    }
    const closeCitationModal = () => {
        setIsCitationModalOpen(false);
        setSelectedCitation(null);
    }

    const handleSubmitReport = () => {
        const reportData = {
            controlDate,
            inspector,
            controlPassed,
            controlDescription,
            alarmService,
            controlType
        };

        axios.post(`http://localhost:5000/api/businesses/${id}/reports`, reportData)
            .then(response => {
                setReports([...reports, response.data]);
                closeReport();
            })
            .catch(error => console.error('Błąd przy dodawaniu raportu:', error));
    };

    const handleSubmitCitation = () => {
        const citationData = {
            citationDate,
            citationAmount,
            citationReason,
        }

        axios.post(`http://localhost:5000/api/businesses/${id}/citations`, citationData)
            .then(response => {
                setCitations([...citations, response.data]);
                closeCitation();
            })
            .catch(error => console.error('Błąd przy dodawaniu cytacji:', error));
    };

    if (!business) return <div>Ładowanie...</div>;

    return (
        <div className="p-6 bg-gray-800 text-white min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Szczegółowe informacje:</h1>
                <div
                    className="flex justify-center space-x-2 border-2 rounded-lg w-[180px] border-gray-600 bg-gray-600 relative">
                    {/* Dodaj raport */}
                    <div className="relative group">
                        <button onClick={openReport} className="bg-green-500 p-2 rounded-full hover:bg-green-700">
                            <FontAwesomeIcon icon={faPlus}/>
                        </button>
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 top-12 w-max p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Dodaj raport
                        </div>
                    </div>
                    {/* Dodaj cytację */}
                    <div className="relative group">
                        <button onClick={openCitation} className="bg-pink-500 p-2 rounded-full hover:bg-pink-700">
                            <FontAwesomeIcon icon={faFileInvoiceDollar}/>
                        </button>
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 top-12 w-max p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Dodaj cytację
                        </div>
                    </div>
                    {/* Edytuj informacje o biznesie */}
                    <div className="relative group">
                        <button
                            onClick={openEditPopup}
                            className={`bg-blue-500 p-2 rounded-full hover:bg-blue-700 ${isDisabled ? 'bg-gray-500 cursor-not-allowed opacity-50' : 'bg-blue-500 hover:bg-blue-700'}`}
                            disabled={isDisabled}
                        >
                            <FontAwesomeIcon icon={faEdit}/>
                        </button>
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 top-12 w-max p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Edytuj informacje o biznesie
                        </div>
                    </div>
                    {/* Usuń biznes */}
                    <div className="relative group">
                        <button onClick={handleDeleteBusiness} className="bg-red-500 p-2 rounded-full hover:bg-red-700">
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 top-12 w-max p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Usuń biznes
                        </div>
                    </div>
                </div>
            </div>

            {notification && (
                <div
                    className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg animate-slideIn transition-transform duration-300 ease-out">
                    {notification}
                </div>
            )}
            { /* Flexbox informacje o biznesie */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg w-[400px] h-[400px]">
                    <h2 className="text-lg font-bold mb-2">Informacje o Biznesie</h2>
                    <p><strong>Nazwa biznesu:</strong> {business.name}</p>
                    <p><strong>Właściciel:</strong> {business.owner}</p>
                    <p><strong>Adres:</strong> {business.address}</p>
                    <p><strong>Strona internetowa: </strong>
                        {business.url ? (
                            <a
                                href={business.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Klik
                            </a>
                        ) : (
                            "Brak linku"
                        )}
                    </p>
                    <p><strong>Ostatnia
                        kontrola:</strong> {reports.length > 0 ? new Date(reports[0].controlDate).toLocaleDateString() : 'Brak raportów'}
                    </p>
                </div>

                {/* Flexbox cytacje */}
                <div className="bg-gray-900 p-4 rounded-lg w-[400px] h-[400px]">
                    <h2 className="text-lg font-bold mb-2">Nałożone cytacje:</h2>
                    {citations.length === 0 ? (
                        <p>Brak cytacji dla tego biznesu.</p>
                    ) : (
                        <>
                            <table className="min-w-full table-auto">
                                <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="py-2 px-4 text-left">Data</th>
                                    <th className="py-2 px-4 text-left">Kwota</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentCitations
                                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sortowanie według daty
                                    .map((citation) => (
                                        <tr key={citation._id} className="bg-red-800 hover:bg-red-700 cursor-pointer" onClick={() => openCitationModal(citation)}>
                                            <td className="py-2 px-4">{new Date(citation.citationDate).toLocaleDateString()}</td>
                                            <td className="py-2 px-4">$ {citation.citationAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginacja */}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => handlePageChangeCitations(currentCitationPage - 1)}
                                    disabled={currentCitationPage === 1}
                                    className="p-2 bg-gray-700 rounded-l-md hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Poprzednia
                                </button>
                                <span className="p-2 bg-gray-700">{currentCitationPage} / {totalPagesCitations}</span>
                                <button
                                    onClick={() => handlePageChangeCitations(currentCitationPage + 1)}
                                    disabled={currentCitationPage === totalPagesCitations}
                                    className="p-2 bg-gray-700 rounded-r-md hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Następna
                                </button>
                            </div>
                        </>
                    )}
                </div>


                {/* Flexbox Notatki */}
                <div className="bg-gray-900 p-4 rounded-lg w-[400px] h-[400px]">
                    <h2 className="text-lg font-bold mb-2">Notatki</h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-gray-800 text-white p-2 rounded h-[250px]"
                    />
                    <button onClick={handleUpdateNotes} className="bg-blue-500 mt-4 p-2 rounded-full hover:bg-blue-700">
                        Zapisz notatkę
                    </button>
                </div>

                { /* Flexbox Raporty */}
                <div className="col-span-1 md:col-span-3 bg-gray-900 p-4 rounded-lg w-[815px] h-[400px]">
                    <h2 className="text-lg font-bold mb-2">Raporty</h2>
                    {reports.length === 0 ? (
                        <p>Brak raportów dla tego biznesu.</p>
                    ) : (
                        <>
                            <table className="min-w-full table-auto">
                                <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="py-2 px-4 text-left">Raport z dnia</th>
                                    <th className="py-2 px-4 text-left">Inspektor</th>
                                    <th className="py-2 px-4 text-left">ID</th>
                                </tr>
                                </thead>
                                <tbody>

                                {/* Sortowanie całości raportów przed paginacją */}
                                {currentReports
                                    .sort((a, b) => new Date(b.controlDate) - new Date(a.controlDate))
                                    .slice((currentReportPage - 1) * reportsPerPage, currentReportPage * reportsPerPage)
                                    .map((report) => (
                                        <tr
                                            key={report._id}
                                            className="hover:bg-gray-700 cursor-pointer"
                                            onClick={() => openReportModal(report)}
                                        >
                                            <td className="py-2 px-4">
                                                {new Date(report.controlDate).toLocaleString()}
                                            </td>
                                            <td className="py-2 px-4">{report.inspector}</td>
                                            <td className="py-2 px-4">{report._id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginacja */}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => handlePageChangeReports(currentReportPage - 1)}
                                    disabled={currentReportPage === 1}
                                    className="p-2 bg-gray-700 rounded-l-md hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Poprzednia
                                </button>
                                <span className="p-2 bg-gray-700">{currentReportPage} / {totalPages}</span>
                                <button
                                    onClick={() => handlePageChangeReports(currentReportPage + 1)}
                                    disabled={currentReportPage === totalPages}
                                    className="p-2 bg-gray-700 rounded-r-md hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Następna
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal dla raportu */}
            {isReportModalOpen && (
                <Dialog open={isReportModalOpen} onClose={closeReportModal}>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <Dialog.Panel
                            className="bg-gray-800 p-6 rounded-lg w-[500px] max-h-[80vh] overflow-auto text-white">
                            <h2 className="text-lg font-bold mb-4 text-center">Szczegóły raportu</h2>

                            <p className="mb-3"><strong>Data
                                kontroli:</strong> {new Date(selectedReport.controlDate).toLocaleDateString()}</p>
                            <hr className="border-gray-600 mb-3"/>

                            <p className="mb-3"><strong>Inspektor:</strong> {selectedReport.inspector}</p>
                            <hr className="border-gray-600 mb-3"/>

                            <p className="mb-3"><strong>Stan kontrola: </strong>
                                <span
                                    className={selectedReport.controlPassed ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                        {selectedReport.controlPassed ? 'Zaliczone' : 'Niezaliczone'}
                    </span>
                            </p>
                            <hr className="border-gray-600 mb-3"/>

                            <p className="mb-3"><strong>Opis:</strong> {selectedReport.controlDescription}</p>
                            <hr className="border-gray-600 mb-3"/>

                            <p className="mb-3"><strong>Serwis
                                alarmowy:</strong> {selectedReport.alarmService ? 'Tak' : 'Nie'}</p>
                            <hr className="border-gray-600 mb-3"/>

                            <p className="mb-3"><strong>Typ kontroli:</strong> {selectedReport.controlType}</p>
                            <hr className="border-gray-600 mb-3"/>

                            <div className="flex justify-center">
                            <button
                                    onClick={closeReportModal}
                                    className="bg-red-500 p-2 rounded-full hover:bg-red-700 mt-4"
                                >
                                    Zamknij
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}

            {/* Modal dla nowego raportu */}
            {isAddReportModalOpen && (
                <Dialog open={isAddReportModalOpen} onClose={closeReport}>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <Dialog.Panel className="bg-gray-900 p-6 rounded-lg w-[500px] max-h-[80vh] overflow-auto">
                            <h2 className="text-lg font-bold mb-2">Dodaj raport</h2>

                            {/* Data i godzina kontroli */}
                            <DatePicker
                                selected={controlDate}
                                onChange={(date) => setControlDate(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15} // interwał czasowy 15 minut
                                dateFormat="Pp" // Format daty i godziny
                                className="w-full bg-gray-700 text-white p-2 rounded"
                            />

                            {/* Inspektor */}
                            <input
                                type="text"
                                value={inspector}
                                onChange={(e) => setInspector(e.target.value)}
                                placeholder="Inspektor"
                                className="w-full bg-gray-800 text-white p-2 rounded mt-4"
                            />

                            {/* Opis kontroli */}
                            <textarea
                                value={controlDescription}
                                onChange={(e) => setControlDescription(e.target.value)}
                                placeholder="Opis kontroli"
                                className="w-full bg-gray-800 text-white p-2 rounded mt-4"
                            />

                            {/* Zaliczone (checkbox) */}
                            <div className="mt-4 flex items-center">
                                <input
                                    type="checkbox"
                                    checked={controlPassed}
                                    onChange={(e) => setControlPassed(e.target.checked)}
                                    className="bg-gray-800 text-white p-2 rounded"
                                />
                                <label className="ml-2 text-white">Kontrola zaliczona?</label>
                            </div>

                            {/* Serwis alarmowy (checkbox) */}
                            <div className="mt-4 flex items-center">
                                <input
                                    type="checkbox"
                                    checked={alarmService}
                                    onChange={(e) => setAlarmService(e.target.checked)}
                                    className="bg-gray-800 text-white p-2 rounded"
                                />
                                <label className="ml-2 text-white">Wykonany serwis systemów?</label>
                            </div>

                            {/* Typ kontroli (dropdown) */}
                            <div className="mt-4">
                                <label className="text-white">Typ kontroli</label>
                                <select
                                    value={controlType}
                                    onChange={(e) => setControlType(e.target.value)}
                                    className="w-full bg-gray-800 text-white p-2 rounded mt-2"
                                >
                                    <option value="Planowana">Planowana</option>
                                    <option value="Nieplanowana">Nieplanowana</option>
                                </select>
                            </div>

                            {/* Kontener dla przycisku - dodajemy flex i justify-center */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={handleSubmitReport}
                                    className="bg-blue-500 p-2 rounded-full hover:bg-blue-700"
                                >
                                    Dodaj raport
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}

            {/* Modal dla cytacji */}
            {isCitationModalOpen && (
                <Dialog open={isCitationModalOpen} onClose={closeCitationModal}>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <Dialog.Panel className="bg-gray-800 p-6 rounded-lg w-[500px] max-h-[80vh] overflow-auto text-white">
                            <h2 className="text-lg font-bold mb-4 text-center">Szczegóły cytacji</h2>

                            <p className="mb-3">
                                <strong>Data wystawienia cytacji:</strong> {new Date(selectedCitation.citationDate).toLocaleDateString()}
                            </p>
                            <hr className="border-gray-600 mb-3"/>

                            <p className="mb-3">
                                <strong>Kwota cytacji:</strong> $ {selectedCitation.citationAmount}
                            </p>
                            <hr className="border-gray-600 mb-3"/>

                            <p className="mb-3">
                                <strong>Powód:</strong> {selectedCitation.citationReason}
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={closeCitationModal}
                                    className="bg-red-500 p-2 rounded-full hover:bg-red-700 mt-4"
                                >
                                    Zamknij
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
            {/* Modal dla nowej cytacji */}
            {isAddCitationModalOpen && (
                <Dialog open={isAddCitationModalOpen} onClose={closeCitation}>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <Dialog.Panel className="bg-gray-900 p-6 rounded-lg w-[500px] max-h-[80vh] overflow-auto">
                            <h2 className="text-lg font-bold mb-2 text-white">Dodaj cytację</h2>

                            {/* Data i godzina kontroli */}
                            <DatePicker
                                selected={citationDate}
                                onChange={(date) => setCitationDate(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15} // interwał czasowy 15 minut
                                dateFormat="Pp" // Format daty i godziny
                                className="w-full bg-gray-700 text-white p-2 rounded"
                            />

                            {/* Kwota cytacji */}
                            <input
                                type="number"
                                value={citationAmount}
                                onChange={(e) => setCitationAmount(e.target.value)}
                                placeholder="Kwota cytacji"
                                className="w-full bg-gray-800 text-white p-2 rounded mt-4"
                            />
                            {/* Powód Cytacji */}
                            <textarea
                                value={citationReason}
                                onChange={(e) => setCitationReason(e.target.value)}
                                placeholder="Powód cytacji"
                                className="w-full bg-gray-800 text-white p-2 rounded mt-4"
                            />

                            {/* Kontener dla przycisku - dodajemy flex i justify-center */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={handleSubmitCitation}
                                    className="bg-blue-500 p-2 rounded-full hover:bg-blue-700"
                                >
                                    Dodaj cytację
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}

        </div>


    );
};
