var azure = require('azure-storage');
var fileService = azure.createFileService("<Enter key here>");

fileService.createFileFromLocalFile('hyperledgerdemo', '', 'package.json', 'package.json', function (error, result, response) {
    if (!error) {
        // file uploaded
    } else {
        console.log(error);
    }
});


fileService.getFileToLocalFile('hyperledgerdemo', '', 'package.json', 'package.json.download', function (error, serverFile) {
    if (!error) {
        // file available in serverFile.file variable
    } else {
        console.log(error);
    }
});