# generator-lazy-backend
A simple generator to create a backend using NodeJS, Express.js and Mongoose
## Getting Started
This instructions will teach you how to install and use lazy-backend generator
### Prerequisites
#### Yeoman
- You need to have yeoman installed. If you don't have it, type the following command: 
```
npm i -g yo
```
#### Database
- You need to have MongoDB running to be able to start the project after creation, but **IT'S NOT REQUIRED WHEN CREATING THE PROJECT**
- If you have Docker installed you can download a mongo image, just type the following
```
docker run --name mongodb -p 27017:2017 -d -t mongo
```
## Installing
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
You just need to run it, for this you can type
```
npm start
```
**Remember to have MongoDB started**
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
  
