# raspCamJS
========
This simple [Node.js](http://nodejs.org/) project demonstrates how you can use the [Socket.IO library](http://http://socket.io/) to push images from the [Raspberry Pi Camera Module](http://www.raspberrypi.org/products/camera-module/) to clients.

## Author
  - Werner Vesterås <wvesteraas@gmail.com>

## Prerequisites
To run this project, you need Node.js installed.  Installing it is very simple:

```bash
$ wget http://node-arm.herokuapp.com/node_latest_armhf.deb
$ sudo dpkg -i node_latest_armhf.deb
````

To verify the installation run `node -v`.  It should return the current version.

## Installation
To install the **raspCamJS** project on your Raspberry Pi, type the following:
```bash
$ git clone https://github.com/ThierryTouin/raspCamJS.git
$ cd raspCamJS
$ npm install
```

## Running in Development
In the **raspCamJS** directory, type:

```bash
$ npm start
```
## Running in Production
In the **raspCamJS** directory, type:

```bash
$ forever start index.js
```


Then, point your browser to:
```
http://<IP_ADDRESS_OF_YOUR_PI>:3000
```

## Authentication
By default, you can use :

|  | Login | Password |
|-----------:|:-----------:|:------------:|
| User1       |        jack |     secret     |
| User2     |      jill |    birthday    |

(You can change it, in the file **/db/user.js**)
