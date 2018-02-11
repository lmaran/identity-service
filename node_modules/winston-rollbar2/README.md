# winston-rollbar2

Forked from https://github.com/Ideame/winston-rollbar and updated to support latest reporter and maintain longer term.

Thanks also to GorillaStack for previously keeping an updated fork:
https://github.com/GorillaStack/winston-rollbar

A [rollbar][1] transport for [winston][0].

## Installation

``` sh
  $ npm install winston-rollbar2
```

## Usage
``` js
  var winston = require("winston");

  // Requiring `winston-rollbar2` will expose
  // `winston.transports.Rollbar`
  //
  require("winston-rollbar2");

  winston.add(winston.transports.Rollbar, {
    rollbarAccessToken: "API_TOKEN"
    rollbarConfig: {
      environment: "development"
    }
  });
```

The Rollbar transport uses [rollbar.js][2] behind the scenes.  Options are the following:

* **rollbarAccessToken**: Rollbar post server item access token.
* **rollbarConfig**:      Rollbar configuration ([more info][3]) (optional).
* **level**:              Level of messages this transport should log. (default: **warn**).
* **silent**:             Boolean flag to disable reporting to Rollbar. (default: **false**).

## Requests

To use Rollbar's request logging include the key **request** with the value of the request object to report.

``` js
app.use("/", (req, res) => {
  winston.error("request example", {request: req});
});
```

[0]: https://github.com/flatiron/winston
[1]: https://rollbar.com
[2]: https://github.com/rollbar/rollbar.js
[3]: https://rollbar.com/docs/notifier/rollbar.js/#configuration-reference
