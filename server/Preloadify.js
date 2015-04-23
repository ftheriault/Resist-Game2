var fs = require('fs');

module.exports = Preloadify = function(list, destinationPath, pathSectionToRemove) {

	this.scanDirectory = function(dir, maxLookupDepth, depth) {
		if (depth == null) {
			depth = 1;
		}

		var files = fs.readdirSync(dir); 
		var resultFiles = [];

		for (var i in files) {
			var file = files[i];
			var fullPath = dir + "/" + file;
			var stats = fs.statSync(fullPath);

			if (stats.isFile()) {
				resultFiles.push(fullPath);
			}
			else if (stats.isDirectory() && depth <= maxLookupDepth) {
				var tmp = this.scanDirectory(fullPath, maxLookupDepth, depth + 1);
				resultFiles = resultFiles.concat(tmp);
			}
		}

		return resultFiles;
	}

	var data = " \
	var myLoader = html5Preloader(); \n\
	var loaderProgressInterval = null; \n\
	var menuShown = false; \n\
\
	$(function() {\n";

	for (var i = 0; i < list.length; i++) {
		var files = this.scanDirectory(list[i], 3);

		for (var j = 0; j < files.length; j++) {
			data += "myLoader.addFiles('" + files[j].replace(pathSectionToRemove, "") + "');\n";
		};		
	}

	data += "\
		loaderProgressInterval = setInterval(function () {\n\
			var progress = parseInt(myLoader.getProgress() * 100);\n\
			$('#loaderPercent').html( progress + '%');\n\
			if (!menuShown && progress > 85) showMenu();\n\
		}, 200);\n\
\
		myLoader.on('finish', function(){ \n\
			clearInterval(loaderProgressInterval);\n\
			if (!menuShown) showMenu();\n\
		});\
\
		myLoader.on('error', function(e){ \n\
			//too bad...\n\
		});	\n\
	});\
	";

	fs.writeFile(destinationPath, data); 
}