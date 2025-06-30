require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-46479220';
    const params = {
        properties: ['name', 'type', 'storage'].join(',')
    };
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`
    };
    try {
        const response = await axios.get(url, { params, headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Custom Objects Table | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-46479220';
    const data = {
        properties: req.body
    };
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.post(url, data, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
