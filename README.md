

## Development

```bash
# start server (Node.js, http://localhost:1410):
npm start

# test with wallaby.js
http://localhost:51245 or http://wallabyjs.com/app

# test with moch
npm test
```

## Production

```bash
npm build-prod

# from dev (http://localhost:1410):
NODE_ENV=staging PORT=1410 node dist/server/app.js

# from stg/prod:
NODE_ENV=staging PORT=1410 node server/app.js
```