import React, { useEffect, useState } from "react";
import axios from "axios";

export const CitationTable = () => {
    const [citations, setCitations] = useState([]);

    useEffect(() => {
        // Pobieranie danych z bazy
        const fetchCitations = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/citationParameters");
                setCitations(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
            }
        };

        fetchCitations();
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-lg font-semibold text-gray-200 mb-4 text-center">
                Tabela cytacji
            </h1>
            {citations.length > 0 ? (
                <table className="table-auto w-full border border-gray-600 rounded-lg">
                    <thead>
                    <tr className="bg-gray-700">
                        <th className="border border-gray-800 px-4 py-2 text-center font-semibold text-white">
                            Opis
                        </th>
                        <th className="border border-gray-800 px-4 py-2 text-center font-semibold text-white">
                            Kwota (USD)
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {citations.map((citation) => (
                        <tr
                            key={citation._id}
                            className="odd:bg-gray-600 even:bg-gray-700"
                        >
                            <td className="border border-gray-800 px-4 py-2 text-white">
                                {citation.description}
                            </td>
                            <td className="border border-gray-800 px-4 py-2 text-right text-white">
                                $ {citation.amount}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-400">Brak danych do wyświetlenia</p>
            )}
        </div>
    );
};
