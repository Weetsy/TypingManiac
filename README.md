# TypingManiac

## A Project By

* Christian Galvez
* Ethan Pongon

## Synopsis

TypingManiac is a website that tests the user's typing performance on randomly generated phrases and sentences. This application interacts with Amazon's DynamoDB to keep track of user data and OAuth2 to authenticate user logins. Website is powered by NodeJS and Express as the backend.

## Running Instructions

After cloning the git repository, run `npm install` from the project's root directory to install all dependencies. Afterwards, you need to run `export OAUTHSECRET=SECRET`, where SECRET is the OAuth secret provided by GitHub. This secret is not included in this repository for obvious reasons. If another GitHub OAuth2 application is used, the client:id variable on line 14 in main.js will need to be changed to that respective application's client id.

After performing the above actions, executing the command `node main.js` should start up the webserver on port 3000. Visiting http://localhost:3000/ on a web browser will now bring up the TypingManiac application. 

Alternatively, the OAUTHSECRET variable can be declared in a .env file in the project's root directory. This removes the need to constantly set the variable between new bash sessions. 

### CS 453 Cloud Data Management - Term Project
