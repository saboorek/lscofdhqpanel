const Business = require('../models/Business');
const Report = require("../models/Report");
const Citation = require("../models/Citation");

const SummaryController = {
    getSummary: async (req, res) => {
        try {
            const activeBusinesses = await Business.countDocuments();
            const reportsCount = await Report.countDocuments();
            const citationsCount = await Citation.countDocuments();

            const totalCitationsAmountResult = await Citation.aggregate([
                {
                    $group: {
                        _id: null,
                        totalCitationsAmount: { $sum: "$citationAmount" }
                    }
                }
            ]);

            const totalCitationsAmount = totalCitationsAmountResult.length > 0 ? totalCitationsAmountResult[0].totalCitationsAmount : 0;

            res.json({
                activeBusinesses,
                reportsCount,
                citationsCount,
                totalCitationsAmount,
            });
        } catch (error) {
            console.error('Błąd pobierania danych:', error);
            res.status(500).json({ error: 'Błąd serwera' });
        }
    }
};

module.exports = SummaryController;