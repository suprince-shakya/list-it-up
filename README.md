# Shopping list application

_It is a simple node express backend for shopping list mobile App_

# Tech Used

- Node Express
- MongoDB

# To run application in development mode

- Make sure you have node installed in your system.
- Make sure you have mongoDB running.
- Copy .env.example to .env and fill up required values

- Now install all the application dependencies

```
  npm install
```

#### Navigate to localhost:8080/login to ensure server is running correctly

# Application environment variables

| Name           | Description                                |
| -------------- | ------------------------------------------ |
| APP_PORT       | Port of the application                    |
| SECRET_KEY     | JSON web token secret                      |
| EXPIRES_IN     | JSON web token expiry time                 |
| ORIGIN         | Comma seperated urls for cors              |
| ORIGIN_REGEX   | For Cors url validation                    |
| DATABASE_URI   | URI of database                            |


