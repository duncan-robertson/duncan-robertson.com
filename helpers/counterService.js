const got = require('got');

const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || "http://localhost:8080";
const COUNTER_SERVICE_QUOTA = process.env.COUNTER_SERVICE_QUOTA || 30;
const COUNTER_SERVICE_COOLDOWN = process.env.COUNTER_SERVICE_QUOTA || 5 * 60 * 1000;
var counterQuota = {};

console.log(`COUNTER SERVICE URL: ${COUNTER_SERVICE_URL}`);

//Rate limiting through quota management for all counter service APIs
function quotaMiddleware(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    counterQuota[ip] = counterQuota[ip] || [];

    var userQuota = counterQuota[ip];
    var timestamp = Date.now();

    if (
        userQuota.length < COUNTER_SERVICE_QUOTA ||
        timestamp - userQuota[0] > COUNTER_SERVICE_COOLDOWN
    ) {
        userQuota.push(timestamp);

        if (timestamp - userQuota[0] > COUNTER_SERVICE_COOLDOWN) {
            //At least oldest timestamp has expired, clean up stale data
            if (timestamp - userQuota[userQuota.length-1] > COUNTER_SERVICE_COOLDOWN) {
                userQuota = [];
            } else {
                let index = 0;
                for (let i = 0; i < userQuota.length; i++) {
                    if (timestamp - userQuota[i] <= COUNTER_SERVICE_COOLDOWN) {
                        index = i;
                        break;
                    }
                }

                userQuota = userQuota.slice(index);
            }
        }

        counterQuota[ip] = userQuota;
        next();
    } else {
        res.status(403).json({
            status: "403",
            message: "API call limit reached"
        });
    }
}

//Simple forwarding logic to downstream service
function forward (req, res) {
    var options = {
        header: req.headers,
        method: req.method,
    }

    if (req.method == "GET") {
        options.searchParams = req.query;
    } else {
        options.json = req.body;
    }

    var requestPath = COUNTER_SERVICE_URL;
    if(req.params.path) {
        requestPath += '/' + req.params.path;
    }

    got(
        requestPath,
        options
    ).json()
    .then(data => {
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.json(data);
    })
    .catch(err => {
        console.warn(`${(new Date()).toISOString()}: Service layer breakdown!`)
        console.error(err);

        res.status(500).json({
            status: "500",
            message: 'Internal error processing service request'
        });
    });
}

module.exports = {
    quotaMiddleware,
    forward
};