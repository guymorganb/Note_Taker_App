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
const myNamespace = "1b671a64-40d5-491e-99b0-da01ff1f3341"
// used for working with incoming json payloads
app.use(express.json()) 



// handle a server error by attaching an error event listener to the res object
// upon recieving a "get" request this send the first page index.html back
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'), (err) => {
    if (err) {
      // Handle the error here
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Successfully load landing page');
      
    }
  });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'), (err) => {
      if (err) {
        // Handle the error here
        console.error('Error sending file:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Successfully loaded notes page');
      }
    });
  });
// allows the browser to access the 'public directory' so it can render eveything necessary like css styles if this is placed before the request above, express will default to sending index.html
app.use(express.static('public'));
//some code that checks the post request from notes.js and writes it to your JSON db file
// define a post route for when a note is sent to the server from the client side
const saveNoteToFile = async (req, res) => {
    // will handle any server errors
    try {
      const { title, text } = req.body; // destructure the body
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
      console.error('Processing error', error);
      res.status(500).send('Internal Server Error');
    }
  };


app.post('/api/notes', saveNoteToFile); 





app.listen(port, () =>{
    console.log(`Listening on port ${port}.`)
})


//   app.use((req, res, next) => {
//     res.locals.httpRequest = `Method: ${req.method}\n`;
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.httpRequest += `URL: ${req.url}\n`;
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.httpRequest += `IP Address: ${req.ip}\n`;
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.httpRequest += `Headers: ${JSON.stringify(req.headers, null, 2)}\n`;
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.httpRequest += `Query: ${JSON.stringify(req.query, null, 2)}\n`;
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.httpRequest += `Params: ${JSON.stringify(req.params, null, 2)}\n`;
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.httpRequest += `Body: ${JSON.stringify(req.body, null, 2)}\n`;
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.httpRequest += `Cookies: ${JSON.stringify(req.cookies, null, 2)}\n`;
//     next();
// });

// app.get('/', (req, res) => {
//     res.set('Content-Type', 'text/plain');
//     res.send(res.locals.httpRequest);
// });

// // post request from a form element
// app.post('/processForm', (req, res) => {
//     const username = req.body.username;

//     if (!username) {
//         // Bad request: 'username' field is missing
//         return res.status(400).send('Bad Request: Missing username field');
//     }

//     // Write data to a file
//     fs.writeFile('username.txt', username, (err) => {
//         if (err) {
//             console.error(err); // Log the entire error object for debugging
//             return res.status(500).send('An internal server error occurred');
//         }

//         res.send('Data written to file successfully');
//     });
// });



// const saveNoteToFile = async (req, res, next) => {
//     try {
//       const { title, text } = req.body;
  
//       if (text !== '') {
//         const newNote = {
//           title,
//           text,
//           noteID: UUIDv5(title, myNamespace),
//         };
  
//         const newNoteString = JSON.stringify(newNote);
  
//         await fs.writeFile('./db/notes.json', newNoteString); // Use await to wait for the file write to complete
//         console.log('Save successful');
//         next(); // Pass control to the next middleware
//       } else {
//         res.status(400).send(req.body);
//         console.log(text);
//       }
//     } catch (error) {
//       console.error('Processing error', error);
//       res.status(500).send('Internal Server Error');
//     }
//   };
  
  
//   const readNoteFromFile = async (req, res) => {
//     try {
//         const data = await fs.readFile('./db/notes.json', 'utf8');
//         const parsedData = JSON.parse(data);
//         const { noteID } = req.body;
    
//         if (Array.isArray(parsedData)) {
//           const matchedNote = parsedData.find((note) => note.noteID === noteID);
    
//           if (matchedNote) {
//             const { title, text, noteID } = matchedNote;
//             res.status(200).json({ message: 'Note received', title, text, noteID });
//           } else {
//             res.status(404).send('Note not found');
//           }
//         } else {
//           if (parsedData.noteID === noteID) {
//             const { title, text, noteID } = parsedData;
//             res.status(200).json({ message: 'Note received', title, text, noteID });
//           } else {
//             res.status(404).send('Note not found');
//           }
//         }
//       } catch (error) {
//         console.error('Error reading file', error);
//         res.status(500).send('Internal Server Error');
//       }
//     };
