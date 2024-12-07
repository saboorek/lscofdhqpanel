const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rolesMap = require('../backend/components/rolesMap.js');

//Modele
const citationParameters = require('./models/CitationParameters');
const Business = require('./models/Business');
const Report = require('./models/Report');
const Citation = require('./models/Citation');
// --- //
require('dotenv').config();

// Logowanie przez Discord
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, httpOnly: true, sameSite: 'lax'}
}));

mongoose.connect(process.env.MONGOOSE_URL)
    .then(() => console.log('Połączono z bazą danych MongoDB'))
    .catch(err => console.log('Błąd połączenia z bazą danych MongoDB', err));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds.members.read', 'guilds'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userGuildData = await fetch(`https://discord.com/api/v10/users/@me/guilds/${process.env.SERVER_ID}/member`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then(res => res.json());

        const filteredRoles = userGuildData.roles
            .map(roleId => rolesMap[roleId])
            .filter(roleName => roleName);

        profile.guildRoles = filteredRoles;
        return done(null, profile);
    } catch (err) {
        console.log('Błąd pobierania ról użytkownika:', err);
        return done(err, null);
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes API

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', passport.authenticate('discord', {
        failureRedirect: '/login',
        successRedirect: 'http://localhost:5173/dashboard'
    })
);

app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({user: req.user, roles: req.user.guildRoles});
    } else {
        res.status(401).json({message: 'Not authenticated'});
    }
});

app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({message: 'Failed to log out'});
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({message: 'Logged out successfully'});
    });
});

app.get('/api/citationparameters', async (req, res) => {
    try {
        const citations = await citationParameters.find();
        res.json(citations);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/api/citationparameters', async (req, res) => {
    const {description, amount} = req.body;
    const newCitation = new citationParameters({description, amount});
    try {
        const savedCitation = await newCitation.save();
        res.status(201).json(savedCitation);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

app.put('/api/citationparameters/:id', async (req, res) => {
    try {
        const updatedCitation = await citationParameters.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(updatedCitation);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

app.delete('/api/citationparameters/:id', async (req, res) => {
    try {
        await citationParameters.findByIdAndDelete(req.params.id);
        res.json({message: 'Cytacja została usunięta'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/businesses', async (req, res) => {
    try {
        const businesses = await Business.find();
        res.json(businesses);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/businesses/:id', async (req, res) => {
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
});

app.post('/api/businesses', async (req, res) => {
    const {name, owner, address, url} = req.body;

    const newBusiness = new Business({
        name,
        owner,
        address,
        url,
    });

    try {
        const savedBusiness = await newBusiness.save();
        res.status(201).json(savedBusiness);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

app.delete('/api/businesses/:id', async (req, res) => {
    try {
        const deletedBusiness = await Business.findByIdAndDelete(req.params.id);
        if (!deletedBusiness) {
            return res.status(404).json({message: 'Nie znaleziono biznesu'});
        }
        res.json({message: 'Biznes został usunięty'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.put('/api/businesses/:id', async (req, res) => {
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
});

app.post('/api/businesses/:id/reports', async (req, res) => {
    const {id} = req.params;
    const {controlDate, inspector, controlPassed, controlDescription, alarmService, controlType} = req.body;

    try {
        const newReport = new Report({
            businessId: id,
            controlDate,
            inspector,
            controlPassed,
            controlDescription,
            alarmService,
            controlType
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({message: 'Błąd podczas tworzenia raportu', error});
    }
});

app.get('/api/businesses/:id/reports', async (req, res) => {
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
});

app.get('/api/summary', async (req, res) => {
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
});

app.get('/api/businesses/:id/citations', async (req, res) => {
    try {
        const { id } = req.params;
        const citations = await Citation.find({ businessId: id });
        res.status(200).json(citations);
    } catch (error) {
        console.error('Error fetching citations:', error);
        res.status(500).json({ message: 'Error fetching citations' });
    }
});

app.post('/api/businesses/:id/citations', async (req, res) => {
    const { id } = req.params;
    const { citationDate, citationAmount, citationReason } = req.body;

    try {
        if (!citationDate || !citationAmount || !citationReason) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newCitation = new Citation({
            businessId: id,
            citationDate,
            citationAmount,
            citationReason
        });

        await newCitation.save();
        res.status(201).json(newCitation);
    } catch (error) {
        console.error('Error creating citation:', error);
        res.status(500).json({ message: 'Błąd podczas tworzenia cytacji', error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
