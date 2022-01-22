# private-message-app
hashing and json web private message app using express node
Step 0: Setup
Install requirements, and make Git repo.
Create messagely database and import schema from data.sql
Step 1: Take a Tour
Many parts of this exercise are already given to you, and shouldn’t need to change:

`app.js`

Pulls in user routes, messages routes, and auth routes
`expressError.js`

Handle errors in express more gracefully
`db.js`

Sets up messagely database
`server.js`

Starts server on 3000
`config.js`

This may be a new file for us. As you build the app (and, in particular, the further study), you may add to it.

Its job is to be a centralized place for constants needed in different places in the application. Other places should require() in these values.

In order to make it easier to keep secret things secret, it also will try to read a file named .env. This is a traditional name for a file containing “environmental variables needed for an application”.

If you create a file like this:

.env
`SECRET_KEY = abc123
This config.js file will read and use it.`

`middleware/auth.js`

Useful middleware for “is a user logged in?” and “is the logged-in user the same as the :username provided in a route?”

Look carefully at this code — it may be slightly different than other versions you’ve seen. Make sure you understand what it is doing!

Step 2: Fix the user model
Step 3: Fix the routes
