# Chat Random

Chat with random people on the internet!

## Architecture & Implementation

**Back-End:**

For my back-end I used a very simple Node/Express.js setup.  It does not include any controllers or models, as the app functionality was relatively simple and I didn't want to go overboard with my setup.

I used Socket.io for my real-time chat functionality, listening to anything emitted from `localhost:3000`.  When users connect to the socket, they initially scan the socket rooms to look for other users that are waiting to be paired.  If no other user is connected and waiting, a new room will be created and the current user will wait for someone else to join.  Users can also leave their current room and join/wait to join another room with a different user.

**Front-End:**

For my front-end I used a React/Redux implementation.  Redux was really only used to store the user of the current session.  

When users navigate to `localhost:3000` they are prompted to enter a username.  Once entered, they are either paired with another user or asked to wait for another user to join the chat.  Once joined, they can chat freely with the other user in a private chat session.  They can type commands such as `/delay 1000 message` which waits for the amount of milliseconds entered before sending the message, or `/hop` which lets them leave the current chat and join another or wait for another user to join theirs.  

## Demo

#### Setup

Getting started is simple! Navigate to the project directory and type the following commands:
```
$ cd src
$ npm install
$ npm start
```

You should be up and running! Feel free to navigate to `localhost:3000` and check it out!

### Notes
