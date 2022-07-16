# ReactMyAdmin

Replacing the xampp's usual php driven mySQL enviroment the phpMyAdmin with a faster, customizeable and feature-rich javascript based application.

The server is using node.js' express server manager, the web application is made using React.js component-oriented design.

## Targeted features

* Syntax highlighting
  * Scope aware handling
  * SQL command capitalization
* Inteligent suggestions
* Custom query builder
  * Query template storage
  * Variable and column library
* Auto limiting query results
* Enum, procedure and fuction support
* View table and variable support

## Setup Guide

For both the database connection, and the port management, creating an enviromental variable file (`.env`) is a mandatory for expected functioning.

### Key variables

> For security reasons, it is not recomended to deploy this system on an enviroment that is accessible from the outside, or further modification required for keeping the credentials secret and/or to limit the access to authorization.

| Key               | Function                                                                                                          | Recomended value |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | :----------------: |
| PORT              | The port where the react application will listen on.                                                              |       4000       |
| SERVER_PORT       | The port where the node server will listen on.                                                                    |       5000       |
| SERVER_HOST       | The hostname where the server is accessible, and where the react app will connect to the server.                  |    localhost    |
| DATABASE_USER     | The user which will connect to the database. Note that this user must have full priviledge for various operation. |       root       |
| DATABASE_PASSWORD | The password for the above mentioned user. (On an unmodified system it might be blank but still has to be set)    |                 |

> Note that React app can only use enviromental variables with the "REACT_APP_" prefix and both the server port and the server host is required. The React app is available on localhost with the specified port to where the server is accepting cross-site call.

### .env.example

> The purpose of this file it to give a syntax and semantic example of how and where the enviromental variables have to be set.

#### Content of an example enviroment file

```.env
# nodejs server port and host
SERVER_PORT=5000
SERVER_HOST="localhost"

# database credentials
DATABASE_USER="Admin"
DATABASE_PASSWORD="admin"

# react variables
PORT=4000
REACT_APP_SERVER_PORT=5000
REACT_APP_SERVER_HOST="localhost"
```

### Setup the server and the client

For installing the required dependencies the following command is needed. These commands have to be executed from the projects' main folder (ReactMyAdmin by default)

```.cmd
npm install
```

> This command fill execute both the client and the server app's package-installation.
>
> For manual installation, this command has to be run in both subfolders.

### Run the enviroment

#### Start the react app

Command for manually actualize the enviromental variables for the react app:

```.cmd
npm run copy-env
```

> This command will copy the .env file into the client folder and will be automatically called when the client developer server is started.

```.cmd
npm run client
```

> Note that the server start will fail if no enviromental variables (.env) file is present in the project's main folder (where the .env.example is located).

#### Run the node server

```.cmd
npm run server
```

### Deploy the frontend-app

```.cmd
npm run client-build
```

> After a successful build, the frontend application will be served on the same port, but keep in mind that after every modification the build process must be repeated for the desired result.
