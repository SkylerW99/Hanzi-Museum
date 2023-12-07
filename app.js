const express = require('express');
const fs = require('fs');
const app = express();
const port = 5501;

// Serve static files from the 'public' directory

app.use(express.static('.'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to handle form submission
app.post('/submit-form', (req, res) => {

  console.log("Recevied a post request.")


  const name = req.body.name;
  const message = req.body.message;

  console.log(name,message);

  // Save the data to a JSON file
  const filePath = 'data.json';
  const dataToSave = { name, message };

  // Read the existing data
  fs.readFile(filePath, (err, data) => {
    // Initialize an empty array if the file doesn't exist or can't be read
    let json = [];
    if (!err) {
      try {
        json = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing JSON', parseErr);
        res.status(500).send('An error occurred on the server.');
        return;
      }
    }

    json.push(dataToSave);

    fs.writeFile(filePath, JSON.stringify(json, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing to file', writeErr);
        res.status(500).send('An error occurred on the server.');
        return;
      }
      console.log('Data written to file');
    });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

