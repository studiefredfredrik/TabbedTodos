# About
Tabbed Todo's provides you with simple checklists for things like shopping and keeping track of tasks.
The page is responsive (mobile friendly), and lets you check off items, and then delete them.
A progress bar keeps track of your progress. Mongodb is used for storage.

## Screenshot
![screenshot of Tabbed Todo's](https://github.com/studiefredfredrik/TabbedTodos/blob/master/screenshots/screenshot1.JPG?raw=true)

## Instructions
If you would like to download the code and try it for yourself:

1. Clone the repo: `git clone git@github.com:studiefredfredrik/TabbedTodos`
2. Install packages: `npm install`
3. Change out the database configuration in config/database.js
4. You will need to have an instance of mongodb running, `mongod`
5. Change out auth keys in config/auth.js
6. Launch: `node server.js`
7. Visit in your browser at: `http://localhost:9080`

## Contributions
I actively monitor the repos and care for them. If you want to contribute to this project you can:
* Create an issue on the issue-tracker 
* Submit a pull-request 
* Fork the repo

## License
Supplied under the MIT license, which can be viewed in the LICENSE file.

## Thanks
Uses code from scotch.io for authentication, with Passport to authenticate users locally, with Facebook, Twitter, and Google.