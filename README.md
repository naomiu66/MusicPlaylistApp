# Music Review application

## Project overview

### Music Review Application is a web service that allows users to search for tracks and artists and write reviews. Music metadata is fetched from [Last.Fm API](https://www.last.fm/api/intro). The project implements JWT-based authentication with cookies and is designed to be easily integrated with a frontend application in the future.
### This project is a pet project created to practice backend development, REST API design using express js framework, and integration with external music services.

## Setup guide
### This project uses Docker containerization, to setup this project you need to install Docker https://www.docker.com/products/docker-desktop/

1) setup .env variables 
```bash
# by default it is 3000
PORT=8080

MONGO_URI="mongodb://mongodb:27017/MusicApp"
REDIS_URL="redis://redis:6379"

SECRET_ACCESS_TOKEN=""
SECRET_REFRESH_TOKEN=""


ACCESS_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d

SALT_ROUNDS="10"

# not neccessary, jamendo api is not using for now
JAMENDO_API_URL="https://api.jamendo.com/v3.0"
JAMENDO_API_CLIENT_ID=""
JAMENDO_API_SECRET=""

LASTFM_API_URL="https://ws.audioscrobbler.com/2.0"
LASTFM_API_KEY=""

NODE_ENV=development
```

2) run docker-compose.yml from root directory of project
```bash
docker compose up -d --build
# -d for running in background
# --build is just for build
```

to stop application run this
```bash
docker compose down
# if you want to clear db use -v flag
```

# API Documentation

## Auth Routes

### Login

Authentication endpoint to exchange user credentials for a logged-in session.

#### URL & Method

- **Method:** `POST`
    
- **URL:** `http://IP:PORT/api/auth/login`
    

#### Request Body

Send a JSON object with the following fields:

``` json
{
  "email": "user@example.com",
  "password": "string"
}

 ```

### Logout

Authentication endpoint to logout

#### URL & Method

- **Method:** `POST`
    
- **URL:** `http://IP:PORT/api/auth/logout`
    

#### Authorization

- **HTTP-only cookie**


### Register

Authentication endpoint to register new user

#### URL & Method

- **Method:** `POST`
    
- **URL:** `http://IP:PORT/api/auth/register`
    

#### Request body

``` json
{
    "name": "string",
    "email": "user@example.com",
    "password": "string"
}
 ```

### Refresh

Authentication endpoint to refresh access token, using refresh token

#### URL & Method

- **Method:** `POST`
    
- **URL:** `http://IP:PORT/api/auth/refresh`
    

#### Authorization

- **HTTP-only cookie** 



## User routes

### Profile

Users endpoint for getting profile information using access token

#### URL & Method

- **Method:** `GET`
    
- **URL:** `http://IP:PORT/api/users/profile`
    

#### Response Body

``` json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "string",
    "updatedAt": "string"
}
 ```

#### Authorization

- **HTTP-only cookie** 


### Get profile of other user

Users endpoint for getting profile information of other user using access token

#### URL & Method

- **Method:** `GET`
    
- **URL:** `http://IP:PORT/api/users/profile/:id`
    

#### Response Body

``` json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "string",
    "updatedAt": "string"
}
 ```

#### Authorization

- **HTTP-only cookie** 