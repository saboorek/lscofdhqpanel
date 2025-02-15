const citationParameters = require("../models/CitationParameters");
const { sendDiscordEmbed } = require('../utils/discordWebhook');

const ParametersController = {
    getCitationParameters: async (req, res) => {
        try {
            const citations = await citationParameters.find();
            res.json(citations);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    createCitationParameters: async (req, res) => {
        const {description, amount} = req.body;
        const newCitation = new citationParameters({description, amount});
        try {
            const savedCitation = await newCitation.save();

            await sendDiscordEmbed({
                title: 'Dodano nowy parametr cytacji!',
                color: 0x00ff00,
                fields: [
                    { name: 'Opis', value: description || 'Nie podano', inline: true },
                    { name: 'Kwota', value: `$ ${amount}` || 'Nie podano', inline: true },
                ]
            });
            res.status(201).json(savedCitation);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    },

    updateCitationParameters: async (req, res) => {
        try {
            const updatedCitation = await citationParameters.findByIdAndUpdate(req.params.id, req.body, {new: true});
            res.json(updatedCitation);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    },

    deleteCitationParameters: async (req, res) => {
        try {
            await citationParameters.findByIdAndDelete(req.params.id);
            res.json({message: 'Cytacja została usunięta'});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },
};

module.exports = ParametersController;