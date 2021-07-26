<p align="center">
<a href="https://expressjs.com/" target="_blank">
<img src="https://i.imgur.com/Ls4Npc0.png" width="400"></a></p>

## Overview of Bookworm

Bookworm or you can call it Mọt Sách is an assignment from Nashtech. This assignment required the participant to execute this individually with technology such as the core framework Express.js, database as PostgreSQL and using React.js and Bootstrap to build a dynamic webpage for the customers.

## Configuration

If you would like to run the project with your local machine. You can first download the code and then run this command to install NPM dependencies. Remember to do this type of installation for both back-end and front-end folder:  

    npm install

Replace `config.example.json` file with your own `config.json` file. You can config the following details in order to gain access to your local database:

    "development": 
    {
        "username": "postgres",
        "password": "your-password",
        "database": "bookworm_app_db",
        "host": "127.0.0.1",
        "dialect": "postgres"
    }

Run the back-end:

    cd "backend"
    npm run dev

Run the React application:

    cd "frontend"
    npm start
