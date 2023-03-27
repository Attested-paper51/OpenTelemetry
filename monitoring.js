// 'use strict'

// // the opentelemetry metrics package
// const { MeterProvider } = require('@opentelemetry/sdk-metrics-base');
// //const { MeterProvider } = require('@opentelemetry/sdk-metrics');
// const { HostMetrics } = require('@opentelemetry/host-metrics');
// const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

// const prometheusPort = PrometheusExporter.DEFAULT_OPTIONS.port
// const prometheusEndpoint = PrometheusExporter.DEFAULT_OPTIONS.endpoint

// // exporter of metrics to Prometheus
// const exporter = new PrometheusExporter(
//     {
//         startServer: true,
//     },
//     () => {
//         console.log(`prometheus scrape endpoint: http://localhost:${prometheusPort}${prometheusEndpoint}`);
//     }
// )

// // our meter to create and manage metrics
// const meter = new MeterProvider({
//       exporter,
//       interval: 1000,
// })//.getMeter('your-meter-name');
// //const meter = new MeterProvider()
// meter.addMetricReader(exporter)
// // const hostMetrics = new HostMetrics({ meter, name: 'example-host-metrics' })
// // hostMetrics.start()

// // -------------------------------------------------------------------
// //created a counter metric with our meter
// const requestCount = meter.createCounter("requests", {
//     description: 'Count all incoming requests'
// })

// const boundInstruments = new Map()

// // counting our requests
// module.exports.countAllRequests = () => {
//     return (req, res, next) => {
//         if(!boundInstruments.has(req.path))
//         {
//             const labels = { route: req.path }
//             const boundCounter = requestCount.bind(labels)
//             boundInstruments.set(req.path, boundCounter)
//         }

//         boundInstruments.get(req.path).add(1);
//         next();
//     }
// }


//-----------------------------------------------------------------------------------------------
//meter.js

'use strict';

const { Resource } = require('@opentelemetry/resources');
const { metrics } = require('@opentelemetry/api');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');
const { MeterProvider,PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');


const meterProvider = new MeterProvider({
  resource: new Resource({'service.name': 'my-express-app'})
});
const metricExporter = new OTLPMetricExporter();
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 10000,
});
meterProvider.addMetricReader(metricReader);
metrics.setGlobalMeterProvider(meterProvider);
