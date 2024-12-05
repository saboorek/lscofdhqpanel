import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Home = () => {
    const [summaryData, setSummaryData] = useState({
        activeBusinesses: 0,
        reportsCount: 0,
        citationsCount: 0,
    });

    useEffect(() => {
        // Funkcja do pobierania danych
        const fetchSummaryData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/summary'); // Upewnij się, że URL jest poprawny
                console.log('Dane z API:', response.data); // Dodaj logowanie odpowiedzi z API
                setSummaryData(response.data);
            } catch (error) {
                console.error('Błąd podczas ładowania danych:', error);
            }
        };

        fetchSummaryData(); // Wywołanie funkcji przy załadowaniu komponentu
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-gray-900 p-6 rounded-lg w-[80%] md:w-[600px]">
                <h2 className="text-2xl font-bold mb-4 text-white">Podsumowanie</h2>
                <table className="min-w-full table-auto">
                    <thead>
                    <tr className="border-b border-gray-600">
                        <th className="py-2 px-4 text-left text-white">Opis</th>
                        <th className="py-2 px-4 text-left text-white">Liczba</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b border-gray-600">
                        <td className="py-2 px-4 text-white">Aktywne biznesy:</td>
                        <td className="py-2 px-4 text-white">{summaryData.activeBusinesses}</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                        <td className="py-2 px-4 text-white">Ilość przeprowadzonych kontroli:</td>
                        <td className="py-2 px-4 text-white">{summaryData.reportsCount}</td>
                    </tr>
                    <tr className="border-b border-gray-600">
                        <td className="py-2 px-4 text-white">Ilość wystawionych cytacji:</td>
                        <td className="py-2 px-4 text-white">{summaryData.citationsCount}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
