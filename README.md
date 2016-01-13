# Studienplaner Web

Website for the [Studienplaner](https://github.com/lukas-eibensteiner/studienplaner)
course and grade tracking application.

## Installation

### Install Dependencies

    npm install
    bower install

### Serve Project

Opens the website in the browser and refreshes automatically when files change:

    gulp

### Build Project

Compiles all scripts and assets and outputs them to the `build` directory:

    gulp build

### Deploy to Web-Server

Builds the project and copies all files to a specified FTP server:

    gulp deploy

In order to enable `gulp deploy` copy the `config.default.json` file, rename it 
to `config.json` and replace the default FTP credentials with custom values.
