import express from 'express'
const app = express();
import fs from 'fs-extra'
const fs = fs;
const port = process.env.PORT;



// The app responds with “Hello World!” for requests to the root URL (/) or route. 
// For every other path, it will respond with a 404 Not Found.
// app.get('/',(req, res) =>{
//     const httpRequest = 
//         `Method: ${req.method}\n` +
//         `URL: ${req.url}\n` +
//         `IP Address: Your IP address is ${req.ip}` +
//         `Headers: ${JSON.stringify(req.headers, null, 2)}\n` +
//         `Query: ${JSON.stringify(req.query, null, 2)}\n` +
//         `Params: ${JSON.stringify(req.params, null, 2)}\n` +
//         `Body: ${JSON.stringify(req.body, null, 2)}\n` +
//         `Cookies: ${JSON.stringify(req.cookies, null, 2)}`;

//     res.set('Content-Type', 'text/plain');
//     res.send(httpRequest);
// })
/**
  each piece of information is converted to a string and appended with a newline character (\n). 
  The JSON.stringify() function is used to convert the headers, query, params, body, and cookies into a nicely formatted JSON string. 
  The arguments null and 2 passed to JSON.stringify are for formatting purposes: null means no transformation on the JSON data, and 2 specifies how many spaces to use for indentation.
  The 'Content-Type' of the response is set to 'text/plain', so that the browser knows to treat the response as plain text.
 */

app.use((req, res, next) => {
    res.locals.httpRequest = `Method: ${req.method}\n`;
    next();
});

app.use((req, res, next) => {
    res.locals.httpRequest += `URL: ${req.url}\n`;
    next();
});

app.use((req, res, next) => {
    res.locals.httpRequest += `IP Address: ${req.ip}\n`;
    next();
});

app.use((req, res, next) => {
    res.locals.httpRequest += `Headers: ${JSON.stringify(req.headers, null, 2)}\n`;
    next();
});

app.use((req, res, next) => {
    res.locals.httpRequest += `Query: ${JSON.stringify(req.query, null, 2)}\n`;
    next();
});

app.use((req, res, next) => {
    res.locals.httpRequest += `Params: ${JSON.stringify(req.params, null, 2)}\n`;
    next();
});

app.use((req, res, next) => {
    res.locals.httpRequest += `Body: ${JSON.stringify(req.body, null, 2)}\n`;
    next();
});

app.use((req, res, next) => {
    res.locals.httpRequest += `Cookies: ${JSON.stringify(req.cookies, null, 2)}\n`;
    next();
});

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(res.locals.httpRequest);
});



app.listen(port, () =>{
    console.log(`Listening on port ${port}.`)
})

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