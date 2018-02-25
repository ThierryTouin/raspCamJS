
/* MODULES */
var exec 	= require("child_process").exec;
var logger 	= require("./logger.js");

var options = "-w 640 -h 480 -q 10 ";

/* VARIABLES */

/* FUNCTIONS */
function takePictureQuick(fileName) {
	exec("raspistill --nopreview -w 640 -h 480 -q 10 -o " + fileName + " -t 9999999 -tl 1000 -th 0:0:0", function(error, stdout, stderr) {
		logger.info("takePictureQuick:" + error);
	});
}
exports.takePictureQuick = takePictureQuick;


function takePicture(fileName) {
	exec("raspistill --nopreview " + options + "-o " + fileName + " -t 9999999 -tl 1000 -th 0:0:0", function(error, stdout, stderr) {
		if(error) {
			if(("" + error).indexOf("mmal") > -1) {
				logger.info("takePicture couldn't take picture. Trying again");
				stopAll();
				takePicture();
			} 
		}
	});
}
exports.takePicture = takePicture;


function stopAll() {
	exec("pkill -f raspi", function(error, stdout, stderr) {

	});
}
exports.stopAll = stopAll;


function setOptionsString(newOptions) {
	var optionsString = "";


	Object.keys(newOptions).forEach(function(key) {
		switch(key) {
			case "night":
				if(newOptions[key] === true) {
					optionsString += "-ex night ";
				}
				break;
			case "width":
				optionsString += "-w " + newOptions[key] + " ";
				break;
			case "height":
				optionsString += "-h " + newOptions[key] + " ";
				break;
			case "quality":
				optionsString += "-q " + newOptions[key] + " ";
				break;
			default:
				break;
		}
	});

	options = optionsString;
}
exports.setOptionsString = setOptionsString;

function restart() {
	stopAll();
	takePicture();
}
exports.restart = restart;