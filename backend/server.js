const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rolesMap = require('./utils/rolesMap.js');
const getConfig = require('./utils/config');

const requireRole = require('./middlewares/requireRole');

// Controllers
const ParametersController = require('./controllers/ParametersController');
const BusinessController = require('./controllers/BusinessController');
const SummaryController = require('./controllers/SummaryController');

require('dotenv').config();

// Logowanie przez Discord
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');

const app = express();

app.use((req, res, next) => {
    const hostname = req.headers.host || req.headers.origin || '';
    req.config = getConfig(hostname);
    next();
});

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: 'lax' }
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
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const userGuildData = await fetch(`https://discord.com/api/v10/users/@me/guilds/${process.env.SERVER_ID}/member`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then(res => res.json());

        const filteredRoles = userGuildData.roles
            .map(roleId => rolesMap[roleId])
            .filter(roleName => roleName);

        console.log('Pobrane role użytkownika:', filteredRoles);

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
}));

app.get('/auth/session', (req, res) => {
    if (req.user) {
        res.json({
            user: req.user,
            roles: req.user.guildRoles || [],
            isAuthenticated: true,
        });
    } else {
        res.status(401).json({
            message: 'Brak aktywnej sesji',
            isAuthenticated: false
        });
    }
});

app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user, roles: req.user.guildRoles });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});

app.get('/api/summary', SummaryController.getSummary);

//CitationParameters API
app.get('/api/citationparameters', ParametersController.getCitationParameters);
app.post('/api/citationparameters', ParametersController.createCitationParameters);
app.put('/api/citationparameters/:id', ParametersController.updateCitationParameters);
app.delete('/api/citationparameters/:id', ParametersController.deleteCitationParameters);
// --- --- //

//Business API
app.get('/api/businesses', BusinessController.getBusiness);
app.get('/api/businesses/:id', BusinessController.getBusinessById);
app.post('/api/businesses', BusinessController.createBusiness);
app.put('/api/businesses/:id', BusinessController.updateBusiness);
app.delete('/api/businesses/:id', BusinessController.deleteBusiness);

app.get('/api/businesses/:id/reports', BusinessController.getReports);
app.post('/api/businesses/:id/reports', BusinessController.createReport);

app.get('/api/businesses/:id/citations', BusinessController.getCitations);
app.post('/api/businesses/:id/citations', BusinessController.createCitation);
// --- --- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
