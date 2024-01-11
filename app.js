const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express()
const port = 3001
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheets = google.sheets({ version: "v4", auth });
  let response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: "A:I",
  });
  const data = response.data.values;
  const rowsCnt = data.length;
  const nextRow = rowsCnt + 1;

  response = await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId,
    range: `A${nextRow}:I${nextRow}`,
    valueInputOption: "RAW",
    resource: {
      values: [
        req.body
      ]
    }
  });
  res.send('done')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})