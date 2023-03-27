
// "use strict";
const PORT = process.env.PORT || "8080";
const express = require("express");
//const { countAllRequests } = require('./monitoring')
require('./tracing')
require('./monitoring')
const { metrics } = require('@opentelemetry/api');
const app = express();

// meter will count all requests
// ofcourse we will export our metrics somewhere we can see them - Grafana and Prometheus
//app.use(countAllRequests())
const meter = metrics.getMeter('express-server');
let counter = meter.createCounter(
  'http.server.request_per_name.counter',
  {
    description: 'The number of requests per name the server got',
  }
);

// getting and responding to requests
// the counter is used to count the number of times a certian request is made
app.get("/", (req, res) => {
  counter.add(1, {
    'route': "/",
    'name' : req.params.name
  });
  res.json("Hello World");
});

app.get("/date", (req, res) => {
  counter.add(1, {
    'route': "/date",
    'name' : req.params.name
  });
  res.json({ today: new Date() });
});

// listening on port
app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});