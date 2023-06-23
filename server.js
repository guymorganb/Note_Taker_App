import express from 'express';
import path from 'path';
import dotenv from 'dotenv';  // must use this in order to use the .env file(loads .env data into process.env object)
import { fileURLToPath } from 'url'; // import this to work with ES6
import { dirname } from 'path'; // needed for working with ES6 
import fs from 'fs-extra';
import { generateUUIDv5 } from './helpers/UUIDv5.js' 
dotenv.config();    // run this to access the .env folder
const app = express(); 
const port = process.env.PORT;
const __dirname = dirname(fileURLToPath(import.meta.url));  
const UUIDv5 = generateUUIDv5;
// used for working with incoming json payloads
app.use(express.json()) 
// handle a server error by attaching an error event listener to the res object
// upon recieving a "get" request this send the first page index.html back

// allows the browser to access the 'public directory' so it can render eveything necessary like css styles if this is placed before the request above, express will default to sending index.html
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'), (err) => {
    if (err) {
      // Handle the error here
      console.error({Message: 'Error sending file:', Error: err});
      res.status(400).send('Bad request');
    } else {
      console.log('Successfully load landing page');
      
    }
  });
});

// get notes
const sendNotesPage = (req, res) => {
    const notesPagePath = path.join(__dirname, '/public/notes.html');
    res.sendFile(notesPagePath, (err)=>{
      if(err){
        // Handle the error here
        console.error({Message: "Error sending file: ", Error: err})
        res.status(500).send('Internal Server Error');
      }else{
        console.log("notes.html successfully sent")
      }
    })
  }
 
const persistJsonData = async (req, res) =>{
  try{
    const dbJsonPath = path.join(__dirname, '/db/notes.json')
    const jsonData = await fs.readFile(dbJsonPath, 'utf8')
    // Trim leading and trailing white space and check if the string is empty or equal to '[]'
    const isEmpty = jsonData.trim() === "" || jsonData.trim() === "[]";
    // check if its an empty dataset
    if (isEmpty) {
      res.status(204).send('No content');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(jsonData);  
    }
  } catch (error) {
    console.error({Message: 'Error1:', Error: error});
    res.status(500).send('Internal Server Error');
  }
}

//some code that checks the post request from notes.js and writes it to your JSON db file
// define a post route for when a note is sent to the server from the client side
const readFileWriteData = async (req, res) => {
    // will handle any server errors
  try {
    const { title, text } = req.body; // destructure the body
    const myNamespace = "1b671a64-40d5-491e-99b0-da01ff1f3341"
    // check if properties are present
    if (text !== '') {
      // create a new object for the data and add a UUID hash to it
      const newNote = {
        title,
        text,
        noteID: UUIDv5(title, myNamespace),
      };
      // note: JSON.parse() turns things into objects and JSON.stringify() tursn objects into strings
      const data = await fs.readFile('./db/notes.json', 'utf8')
      const array = [];
      if(data.trim() == ""){
        // add new note to array begining
        array.unshift(newNote)
        // write the new note
        await fs.writeFile('./db/notes.json', JSON.stringify(array));  
      }else{
        //read file
        const jsonItem = await fs.readFile('./db/notes.json', 'utf8')
        // parse json file data into an object array
        const jsonObject = JSON.parse(jsonItem)
        // add incoming payload into the array
        jsonObject.unshift(newNote)
        // write the updated array, turning it into a JSON string, now its accesible like this..console.log(jsonObject[1].noteID)
        await fs.writeFile('./db/notes.json', JSON.stringify(jsonObject))
      }
      // Send back the incoming payload back in the response as an array so the data can be worked with on client side
      res.status(200).json(newNote); 
    } else {
      res.status(400).send(req.body);
    }
  } catch (error) {
    console.error({Message: 'Processing error', Error: error});
    res.status(500).send('Internal Server Error');
    }
};
// handle delete requests
const readFileDeleteData = async (req, res) => {
  try{
    // grabs the data to delete
    let target = req.body.dataID
    // read file and wait for response
    const jsonElement = await fs.readFile('./db/notes.json', 'utf8');
    // turn read data into an array
    const dataArray = JSON.parse(jsonElement);
    // filters dataArray and returns a new array of elements not matching the target
    const newDataArray = dataArray.filter((element) => element.noteID !== target)  
    // write the data to db.json
    await fs.writeFile('./db/notes.json', JSON.stringify(newDataArray));
    // respond with a sucess status code
    res.status(200).json(req.body)
  }catch(error){
    console.error({Message: "Server error, request failed", Error: error})
  }
}

app.get('/api/json', persistJsonData)
app.get('/notes', sendNotesPage)
app.delete('/api/notes', readFileDeleteData)
app.post('/api/notes', readFileWriteData); 

app.listen(port, () =>{
    console.log(`Listening on port ${port}.`)
})
