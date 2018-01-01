[ ![Codeship Status for lmaran/identity-service](https://app.codeship.com/projects/2e48edb0-cf9f-0135-e213-06060185c4e3/status?branch=master)](https://app.codeship.com/projects/262255)

## Development

```bash
# start server:
npm start

# start browser:
http://some-app.dev.identity.appstudio.ro:1420

# test with wallaby.js
ctrl-shift-R-R (start)
ctrl-shift-R-S (stop)
http://localhost:51245 or http://wallabyjs.com/app (view results)
 
# test with mocha
npm test
```

## Staging (from local)

```bash
npm build-prod

# start server:
NODE_ENV=staging MONGO_URI=mongodb://localhost/identity-service-stg PORT=1422 node dist/server/server.js

# start browser:
http://some-app.dev.identity.appstudio.ro:1422
```

## Staging

```bash
# start browser:
https://some-app.stg.identity.appstudio.ro
```

## Production

```bash
# start browser:
https://some-app.identity.appstudio.ro
```