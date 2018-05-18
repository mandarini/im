# Im

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

## What is this?

This app receives mobile phone sensor data from a websocket server.

## How to use?

Use the other app to send data from your phone here.

## I want it!

Accessible at

[mandarini.github.io/im](https://mandarini.github.io/im/)

## I want it locally

### You need the server

Download and run the nodejs websocket server:

```
git clone git@github.com:mandarini/wsserver.git
cd wsserver
node app.js
```

### You need to connect this app to the server

You have to change the server address on `websocket.service.ts` to be the one of your local server,
the one you started on the previous step.

1. you need the IP of your machine on your local network.
Run `ifconfig` or `ipconfig` (according to your OS) and copy your inet address.

2. go to line 16 in the `websocket.service.ts` file and change
`this.socket = io('wss://psybercity.herokuapp.com/');` to `this.socket = io('http://xx.xx.xx.xx:5000')`
where `xx.xx.xx.xx` your local address and `5000` the port that our server is listening to
(see the `app.js` file in the wsserver project)

### You need to run the app (duh)!

In the app directory run the following command:

```
ng serve --host 0.0.0.0 --port 4201
```

It is important to specify the host with the `--host` flag, because this will expose your application to other machines in the same network, and you will be able to access it via your mobile phone (which is what you need to do basically), once it is connected to the same network as your computer!

Here we are also specifying a port, because we will be also running the laptop application later, and it will take up port 4200 by default.

### You need to navigate to your app on your mobile phone

Open a browser on your mobile phone (preferably chrome of firefox for more sensors) and navigate to your locally IP
address (the one we found before, running `ifconfig`), on port 4200.

### You need, now, the desktop app!

1. Download and run the nodejs websocket server:

```
git clone git@github.com:mandarini/im.git
cd im/
```

2. Connect it to the local websocket server, like we did with the mobile web app.
Go to line 16 in the `websocket.service.ts` file and change
`this.socket = io('wss://psybercity.herokuapp.com/');` to `this.socket = io('http://xx.xx.xx.xx:5000')`
where `xx.xx.xx.xx` your local address and `5000` the port that our server is listening to
(see the `app.js` file in the wsserver project).

3. ng server

4. Open a browser and navigate to `http://localhost:4200`

### THAT'S IT!

You made it!
