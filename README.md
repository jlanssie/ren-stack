# REN stack

A simple web stack with Redis, ExpressJS &amp; NodeJS.

## Setup

### 1. Install dependencies

Node
NPM
- compression
- cookie-parser
- ejs
- express
- helmet
- keygrip
- redis

### 2. Create services for Redis & NodeJS

Create a service in systemd (GNU/Linux) or homebrew (Mac). Note the port for Redis

### 3. Review Server.js file

Adapt all configurations inside the Server.js file. 

### 4. Adapt templates 

The templates are generated from inside your server.js file and/or router.js files. Elaborate them to your convenience.

### 5. Add static files to Public folder

Add static files such as scripts, css, favicon, apple-touch-icon, static html pages... to the public folder

### 6. Configure SSL certificates (optional)

### 7. Start Node service


## Improvements

Possible improvements inculde 

- a CMS interface to save data to a database and server.js file interaction with this database to generate templates, stored in Redis.