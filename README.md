# generator-lazy-backend
A simple generator to create a backend using NodeJS, Express.js and Mongoose

This generator is highly inspired by JHipster
## About the project
### Database
The project is using MongoDB as its database
### HTTP Request Handling
The project is using ExpressJS as its Request Handling
### Where the project can be used
The focus is to use for small objectives
## Prerequisites
#### Yeoman
- You need to have yeoman installed. If you don't have it, type the following command: 
```
npm i -g yo
```
#### Database
- You need to have MongoDB running to be able to start the project after creation, but **IT'S NOT REQUIRED WHEN CREATING THE PROJECT**
- If you have Docker installed you can download a mongo image, just type the following command
```
docker run --name mongodb -p 27017:2017 -d -t mongo
```
## Installation
You can install the package from npm
```
npm i -g generator-lazy-backend
```
## Usage
### run the generator
```
yo lazy-backend
```
### After the project creation
Just type the following command
```
npm start
```
**Remember to have MongoDB started**

**The MongoDB port by default is 27017, if use a diferent port you can change it on .env file**
## project struct
*[+] indicates that it is a folder*
```
|-- Project-Name[+]
  |-- src[+]
    |-- app[+]
      |-- controllers[+]
      |-- middlewares[+]
      |-- models[+]
      |-- validators[+]
    |-- config[+]
    |-- index.js
    |-- routes.js
    |-- server.js
  |-- package.json
  |-- package-lock.json
  |-- .editorconfig
  |-- .env
  |-- .eslintrc.js
  |-- .gitignore
  ```
  If you want to check how the genereted project is, you can check this [github](https://github.com/UnDer-7/template-project)
  ## Project Dependencies
  1. bcrypt
     - Responsible for encrypting the user's password
     - Only added if you add JWT validations
     - [npm](https://www.npmjs.com/package/bcrypt)
  2. jsonwebtoken
     - Makes possible to create a JWT Token
     - Only added if you add JWT validations
     - [npm](https://www.npmjs.com/package/jsonwebtoken)
  3. dotenv
     - Permit the posibilite to use environment variables
     - [npm](https://www.npmjs.com/package/dotenv)
  4. express
     - Handles HTTP requests
     - [npm](https://www.npmjs.com/package/express)
  5. express-async-handler
     - As described by the developers:
     > Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers
     - [npm](https://www.npmjs.com/package/express-async-handler)
  6. express-validation
     - Use the joi validations, if the validation fails a response with error is returned
     - [npm](https://www.npmjs.com/package/express-validation)
  7. joi
     - Responsible to validate the fields
     - [npm](https://www.npmjs.com/package/joi)
  8. mongoose
     - MongoDB ODM for NodeJS
     - [npm](https://www.npmjs.com/package/mongoose)
  9. mongoose-paginate
     - Do the pagination
     - [npm](https://www.npmjs.com/package/mongoose-paginate)
 10. require-dir
     - Reduce the amount of require() you will make
     - [npm](https://www.npmjs.com/package/require-dir)
 11. youch
     - Makes NodeJS' error more readable
     - [npm](https://www.npmjs.com/package/youch)
### Dev-Dependencies 
  1. eslint
     - Lint the code
     - Use the standard configuration
     - [npm](https://www.npmjs.com/package/eslint)
  2. nodemon
     - Restarts the application when a file change occurs
     - [npm](https://www.npmjs.com/package/nodemon)
  
