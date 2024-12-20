const Business = require('../models/Business');
const Report = require("../models/Report");
const Citation = require("../models/Citation");
const {sendDiscordEmbed} = require('../utils/discordWebhook');

const BusinessController = {
    getBusiness: async (req, res) => {
        try {
            const businesses = await Business.find();
            res.json(businesses);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },
    getBusinessById: async (req, res) => {
        const {id} = req.params;

        try {
            const business = await Business.findById(id);
            if (!business) {
                return res.status(404).json({message: `Business with ID ${id} not found`});
            }
            res.json(business);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
    createBusiness: async (req, res) => {
        const {name, owner, address, url} = req.body;

        const newBusiness = new Business({
            name,
            owner,
            address,
            url,
        });

        try {
            const savedBusiness = await newBusiness.save();

            await sendDiscordEmbed({
                title: 'Dodano nowy biznes!',
                description: `Biznes **${name}** został dodany do bazy danych
                \n**Właściciel**\n${owner}
                \n**Adres**\n${address}
                \n**link do forum**\n${url}`,
                color: 0x00ff00,
            });
            res.status(201).json(savedBusiness);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    },
    deleteBusiness: async (req, res) => {
        try {
            const deletedBusiness = await Business.findByIdAndDelete(req.params.id);
            if (!deletedBusiness) {
                return res.status(404).json({message: 'Nie znaleziono biznesu'});
            }
            res.json({message: 'Biznes został usunięty'});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    updateBusiness: async (req, res) => {
        const {id} = req.params;
        const {notes} = req.body;

        try {
            const business = await Business.findById(id);
            if (!business) {
                return res.status(404).json({message: `Biznes o ID ${id} nie został znaleziony`});
            }

            business.notes = notes;

            const updatedBusiness = await business.save();
            res.status(200).json(updatedBusiness);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    getReports: async (req, res) => {
        const {id} = req.params;

        try {
            const business = await Business.findById(id);
            if (!business) {
                return res.status(404).json({message: `Business with ID ${id} not found`});
            }

            const reports = await Report.find({businessId: id});

            res.status(200).json(reports);
        } catch (err) {
            res.status(500).json({message: 'Błąd podczas pobierania raportów', error: err.message});
        }
    },

    createReport: async (req, res) => {
        const {id} = req.params; // ID biznesu
        const {controlDate, inspector, controlPassed, controlDescription, alarmService, controlType} = req.body;

        try {
            const business = await Business.findById(id);
            if (!business) {
                return res.status(404).json({message: `Biznes o ID ${id} nie został znaleziony.`});
            }

            const newReport = new Report({
                businessId: id,
                controlDate,
                inspector,
                controlPassed,
                controlDescription,
                alarmService,
                controlType,
            });

            await newReport.save();

            await sendDiscordEmbed({
                title: 'Dodano nowy raport!',
                description: `### **Nazwa biznesu**\n${business.name}
                \n### **Data kontroli**\n${controlDate}
                \n### **Inspektor**\n${inspector}
                \n### **Status kontroli**\n${controlPassed ? 'Tak' : 'Nie'}
                \n### **Wykonano serwis przycisków?**\n${alarmService ? 'Tak' : 'Nie'}
                \n### **Typ Kontroli**\n${controlType}
                \n### **Opis**\n${controlDescription}`,
                color: 0x007bff,
            });

            res.status(201).json(newReport);
        } catch (error) {
            console.error('Błąd podczas tworzenia raportu:', error);
            res.status(500).json({message: 'Błąd podczas tworzenia raportu', error});
        }
    },

    getCitations: async (req, res) => {
        try {
            const {id} = req.params;
            const citations = await Citation.find({businessId: id});
            res.status(200).json(citations);
        } catch (error) {
            console.error('Error fetching citations:', error);
            res.status(500).json({message: 'Error fetching citations'});
        }
    },
    createCitation: async (req, res) => {
        const {id} = req.params;
        const {citationDate, citationAmount, citationReason} = req.body;

        try {
            if (!citationDate || !citationAmount || !citationReason) {
                return res.status(400).json({message: 'Missing required fields'});
            }

            const business = await Business.findById(id);
            if (!business) {
                return res.status(404).json({message: `Biznes o ID ${id} nie został znaleziony.`});
            }

            const newCitation = new Citation({
                businessId: id,
                citationDate,
                citationAmount,
                citationReason
            });

            await newCitation.save();

            await sendDiscordEmbed({
                title: 'Dodano nową cytację!',
                description: `### **Nazwa biznesu **\n${business.name}\n### **Data nałożenia**\n${citationDate}\n### **Kwota cytacji**\n$ ${citationAmount}\n### **Powód nałożenia cytacji**\n${citationReason}`,
                color: 0xff0000,

            });
            res.status(201).json(newCitation);
        } catch (error) {
            console.error('Error creating citation:', error);
            res.status(500).json({message: 'Błąd podczas tworzenia cytacji', error});
        }
    },

};

module.exports = BusinessController;