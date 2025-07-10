const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const clientId = '1dET0vN9dx7eyVzSGqgkQuHNSPYVri9p';
const clientSecret = 'UVtLE6oeszqEKlTZ';

app.use(bodyParser.json());
app.use(express.static('public'));

let accessToken = null;

async function getAccessToken() {
  const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', null, {
    params: {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    }
  });
  accessToken = response.data.access_token;
}

app.post('/api/vuelos', async (req, res) => {
  if (!accessToken) await getAccessToken();

  try {
    const params = {
      originLocationCode: req.body.origen,
      destinationLocationCode: req.body.destino,
      departureDate: req.body.fecha,
      adults: req.body.adultos || 1,
      max: 20
    };

    if (req.body.clase) {
      params.travelClass = req.body.clase;
    }

    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda de vuelos' });
  }
});

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
