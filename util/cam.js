var Campi = require('campi');

var base64 = require('base64-stream');

var numClients = 0;
var campi = new Campi();
var startCam = 0;

const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

var fs = require('fs');
var dir = './data';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
}


  function connection(io) {

    successlog.info(`connection() start io=` + io);
    
    io.on('connection', function(socket) {
      
        numClients++;
  
        socket.on("clientMsg", function (data) {
          io.emit('serverMsg', { numClients: numClients, startCam:startCam });
          successlog.info(`Client user agent : ${data}`);
          successlog.info(`Connected clients: ${numClients}`);
        });
      
        socket.on('disconnect', function() {
            numClients--;  
            successlog.info(`Connected clients: ${numClients}`);
            io.emit('serverMsg', { numClients: numClients, startCam:startCam });
        });
  
        socket.on('startCam', function(socket) {    
          successlog.info(`startCam()`);
          startCam = 1;
          io.emit('serverMsg', { numClients: numClients, startCam:startCam });
        });

        socket.on('sendCam', function(socket) {    
            successlog.info(`sendCam()`);

            campi.getImageAsFile({
                width: 640,
                height: 480,
                nopreview: true,
                timeout: 1,
                hflip: true,
                vflip: true
            }, './data/output'+Date.now()+'.jpg', function (err) {
                if (err) {
                    throw err;
                }
                successlog.info('Image captured');
            });

        });
          

        socket.on('stopCam', function(socket) {    
          successlog.info(`stopCam()`);
          startCam = 0;
          io.emit('serverMsg', { numClients: numClients, startCam:startCam });
      });
      
    });
  

  };

  function listen(io) {

      successlog.info(`listen() start io=` + io);
      var busy = false;
      setInterval(function () {
          if (!busy && startCam==1 && numClients>0) {
              busy = true;
              campi.getImageAsStream({
                  width: 640,
                  height: 480,
                  shutter: 200000,
                  timeout: 1,
                  nopreview: true
              }, function (err, stream) {
                  var message = '';

                  var base64Stream = stream.pipe(base64.encode());

                  base64Stream.on('data', function (buffer) {
                      message += buffer.toString();
                  });

                  base64Stream.on('end', function () {
                      io.sockets.emit('image', message);
                      busy = false;
                  });
              });
          }
      }, 100);
    };

    function listenDebug(io) {

      successlog.info(`listenDebug() start io=` + io);
      var busy = false;
      setInterval(function () {
        //successlog.info(`listenDebug() interval`);
        if (!busy && startCam==1 && numClients>0) {
            //busy = true;
            successlog.info(`Take photo...`);
        }
      }, 1000);
    

    };

  



module.exports = {
  listenDebug : listenDebug,
  listen : listen,
  connection : connection
};