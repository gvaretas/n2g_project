const awsIot = require('aws-iot-device-sdk');
const epochTime = Math.floor(new Date().getTime() / 1000);
require('dotenv').config();


let sensor_measurements = {
    "metadata": {
        "gateway_ip"  : "23412455",
        "labelpartner_id": "WncECNxn"
    },
    "results" : [
        {
            "timestamp": {
                "seconds"     : epochTime,
                "microseconds": 0
            },
            "value"    : 300 + Math.floor(Math.random() * 700)
        }
    ]
};

const clientId = sensor_measurements.metadata.labelpartner_id;

const device = awsIot.device({
    keyPath: process.env.DEVICE_KEYPATH,
        certPath: process.env.DEVICE_CERTPATH,
            caPath: process.env.DEVICE_CAPATH,
                clientId: process.env.DEVICE_CLIENT_ID,
                    host: process.env.HOST
                        });
                        device
                        .on('connect', function() {
                        console.log('connect');
                        // device.subscribe('topic_1');
                        device.publish('device/' + process.env.DEVICE_CLIENT_ID, JSON.stringify(sensor_measurements),null,() => device.end());
                        // console.log('after publish');
                    });

                        device
                        .on('message', function(topic, payload) {
                        console.log('message', topic, payload.toString());
                    });

