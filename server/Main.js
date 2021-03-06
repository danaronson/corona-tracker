/*
Quick and dirty sqlite server

Uses a library of functions
 */
process.env.DEBUG="corona-tracker:*";
const debug = require('debug')('corona-tracker:Main');
const express = require('express'); // http://expressjs.com/
const morgan = require('morgan'); // https://www.npmjs.com/package/morgan
//TODO-CT const { appContent, appList, appSelect } = require('./sqllib.js');

const config = {
  morgan: ':method :url :req[range] :status :res[content-length] :response-time ms',
  port: 5000,
  static:  process.cwd() + "/../dist",
  languages: process.cwd() + "/../languages/json",
}
const app = express();

app.use(morgan(config.morgan)); // TODO write to a file then recycle that log file (see https://www.npmjs.com/package/morgan )
app.use(express.json());
/*TODO-CT replace with functions from API
app.get('/list', appList);
app.get('/content', appContent);
app.get('/select', appSelect);
*/
app.get('/', (req, res) =>
  res.sendFile("client.html",
    { root: config.static },
    err => { if (err) {res.status(404).send(err.message);}}));
app.get('/dist/:file', (req, res) =>
  res.sendFile(req.params.file,
    { root: config.static },
    err => { if (err) {res.status(404).send(err.message);}}));
app.get('/languages/:file', (req, res) =>
  res.sendFile(req.params.file,
    { root: config.languages },
    err => { if (err) {res.status(404).send(err.message);}}));

const server = app.listen(config.port); // Intentionally same port as Python gateway defaults to, api should converge
debug("Server starting on port %s", config.port);
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    debug('A server, probably another copy of this, is already listening on port %s', config.apps.http.port);
  } else {
    debug('Server hit error %o', err);
    throw (err); // Will be uncaught exception
  }
});
