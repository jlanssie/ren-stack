# REN stack

A simple web stack with Redis, ExpressJS &amp; NodeJS.

The NodeJS app contains several files:
- server.js: contains server configurations and starts a process that listens on the desired ports.
- router.js: contains routing configurations.
- logger.js: contains a few basic logging functions.
- errorhandler.js: contains the error handling and routing configurations to error pages.

## Setup

### 1. Install dependencies

Node
NPM +
- compression
- cookie-parser
- ejs
- express
- helmet
- keygrip
- redis

### 2. Create services for Redis & NodeJS

Create a service in systemd (GNU/Linux) or homebrew (Mac). Note the port for Redis.

### 2opt. Install & Configure Let's Encrypt to manage SSL certificates

### 3. Review Server.js file

Adapt all configurations inside the server.js file. 

### 4. Adapt templates 

Templates are generated from inside the router.js file.

### 5. Add static files to Public folder

Add static files such as scripts, css, favicon, apple-touch-icon, static html pages... to the public folder.

### 6. Start Node service


## Improvements

Possible improvements inculde 

- a CMS interface to save data to a database and server.js file interaction with this database to generate templates, stored in Redis.