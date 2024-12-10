import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Disclosure } from "@headlessui/react";
import { Dialog } from "@headlessui/react";

export const ManageParameters = () => {
    const [citations, setCitations] = useState([]);
    const [formData, setFormData] = useState({ description: "", amount: "" });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);

    useEffect(() => {
        const fetchCitations = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/citationparameters");
                setCitations(response.data);
            } catch (error) {
                console.error("Błąd pobierania danych:", error);
            }
        };
        fetchCitations();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (currentEditId) {
                const updatedCitation = await axios.put(
                    `http://localhost:5000/api/citationparameters/${currentEditId}`,
                    formData
                );
                setCitations(citations.map(citation =>
                    citation._id === currentEditId ? updatedCitation.data : citation
                ));
            } else {
                const response = await axios.post("http://localhost:5000/api/citationparameters", formData);
                setCitations([...citations, response.data]);
            }
            closePopup();
        } catch (error) {
            console.error("Błąd podczas zapisywania danych:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/citationparameters/${id}`);
            setCitations(citations.filter((citation) => citation._id !== id));
        } catch (error) {
            console.error("Błąd usuwania cytacji:", error);
        }
    };

    const openPopup = (citation = null) => {
        if (citation) {
            setCurrentEditId(citation._id);
            setFormData({ description: citation.description, amount: citation.amount });
        } else {
            setCurrentEditId(null);
            setFormData({ description: "", amount: "" });
        }
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setFormData({ description: "", amount: "" });
        setCurrentEditId(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center text-gray-200 mb-6">Zarządzaj parametrami</h1>

            {/* Zakładka: Zarządzanie cytacjami */}
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button
                            className={`flex justify-between items-center w-full p-4 bg-gray-600 text-gray-200 rounded-lg mb-2 border border-gray-600 ${
                                open ? "bg-gray-700" : ""
                            }`}
                        >
                            <span className="text-lg font-semibold">Zarządzanie cytacjami</span>
                            <div className="relative group">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="text-green-500 border border-green-500 rounded-full p-1 cursor-pointer hover:bg-green-500 hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPopup();
                                    }}
                                />
                                <div
                                    className="absolute left-1/2 transform -translate-x-1/2 top-12 w-max p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    Dodaj parametr cytacji
                                </div>
                            </div>
                        </Disclosure.Button>
                        <Disclosure.Panel className="p-4 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 mb-6">
                            <table className="table-auto w-full border border-gray-600 rounded-lg">
                                <thead>
                                <tr className="bg-gray-800">
                                    <th className="border border-gray-600 px-4 py-2">Opis</th>
                                    <th className="border border-gray-600 px-4 py-2">Kwota (USD)</th>
                                    <th className="border border-gray-600 px-4 py-2">Akcje</th>
                                </tr>
                                </thead>
                                <tbody>
                                {citations.map((citation) => (
                                    <tr key={citation._id} className="odd:bg-gray-800 even:bg-gray-900">
                                        <td className="border border-gray-600 px-4 py-2">{citation.description}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            $ {citation.amount}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">
                                            {/* Kontener dla ikon i tooltipów */}
                                            <div className="flex justify-center space-x-4">
                                                {/* Edytuj */}
                                                <div className="relative group">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="text-blue-500 cursor-pointer"
                                                        onClick={() => openPopup(citation)}
                                                    />
                                                    <div
                                                        className="absolute left-1/2 transform -translate-x-1/2 top-12 w-max p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        Edytuj parametr
                                                    </div>
                                                </div>

                                                {/* Usuń */}
                                                <div className="relative group">
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="text-red-500 cursor-pointer"
                                                        onClick={() => handleDelete(citation._id)}
                                                    />
                                                    <div
                                                        className="absolute left-1/2 transform -translate-x-1/2 top-12 w-max p-2 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        Usuń parametr
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            {/* Zakładka: Kolejna kategoria */}
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button
                            className={`flex justify-between items-center w-full p-4 bg-gray-600 text-gray-200 rounded-lg border border-gray-600 ${
                                open ? "bg-gray-700" : ""
                            }`}
                        >
                            <span className="text-lg font-semibold">Kolejna kategoria</span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="p-4 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 mb-6">
                            <p>Brak danych do wyświetlenia.</p>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            {/* Popup */}
            <Dialog open={isPopupOpen} onClose={closePopup} className="relative z-50">
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 text-gray-200 border border-gray-600">
                        <Dialog.Title className="text-xl font-bold mb-4">
                            {currentEditId ? "Edytuj cytację" : "Dodaj cytację"}
                        </Dialog.Title>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="description"
                                placeholder="Opis"
                                value={formData.description}
                                onChange={handleChange}
                                className="border w-full p-2 mb-2 bg-gray-900 text-gray-200 border-gray-600"
                            />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Kwota"
                                value={formData.amount}
                                onChange={handleChange}
                                className="border w-full p-2 bg-gray-900 text-gray-200 border-gray-600"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={closePopup}
                                className="bg-gray-600 text-gray-200 px-4 py-2 rounded mr-2"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Zapisz
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};
