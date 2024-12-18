const fetch = require('node-fetch');

// Funkcja do wysyłania powiadomień jako embed
const sendDiscordEmbed = async ({ title, description, color = 3447003, fields = [] }) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error('URL webhooka nie jest ustawiony w pliku .env');
        return;
    }

    const payload = {
        username: 'Wydział dokumentów i papierologii LSCoFD HQ', // Opcjonalna nazwa wyświetlana w wiadomości
        embeds: [
            {
                title, // Tytuł embedu
                description, // Opis główny
                color, // Kolor w formacie HEX (np. 3447003 = niebieski)
                fields, // Dodatkowe pola
                timestamp: new Date(), // Automatyczne ustawienie czasu
            },
        ],
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('Błąd przy wysyłaniu powiadomienia Discord:', response.statusText);
        } else {
            console.log('Powiadomienie wysłane pomyślnie.');
        }
    } catch (error) {
        console.error('Błąd podczas wysyłania powiadomienia Discord:', error);
    }
};

module.exports = { sendDiscordEmbed };
