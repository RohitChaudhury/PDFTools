// the main routing page and other packages

const express = require('express');
const app = express();
const path = require('path');
const port = 4000;
const multer = require('multer');
const upload = multer({ dest: 'assets/uploads/' });

const merge_pdf = require('./merger'); // merge pdf file module
const docxConverter = require('docx-pdf'); // convert to pdf module

// to allow static files to served into the server from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    // Set explicit MIME types for CSS and JavaScript files
    setHeaders: (response) => {
        response.setHeader('Content-Type', 'text/css');
        response.setHeader('Content-Type', 'text/javascript');
    }
}));


app.get('/', (req, res) => {
    console.log('The landing page is Routed Successfully');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log('The page is running on the server localhost:' + port + '/');
});


// to merge PDFs code
app.post('/merge_pdf', upload.array("pdf_file", 10), (request, response, next) => {
    // response.send({ data: request.files });
    let files = request.files.length;
    if (files < 2) {
        response.send('Please Upload Two PDF File to Merge into a Single PDF!');
        return;
    }
    let fileName = merge_pdf(path.join(__dirname, request.files[0].path), path.join(__dirname, request.files[1].path));

    fileName.then(value => {
        // response.redirect('localhost:4000/' + 'assets/merge_pdf/' + value + '.pdf'); // Not working because of the schema error in localhost in the browser
        response.sendFile(path.join(__dirname, ('assets/merge_pdf/' + value + '.pdf')));
    })
});

// to convert docx to pdf code -
app.post('/convert_pdf', upload.array('doc_file', 1), (request, response, next) => {
    // response.send({ data: request.files });
    if (!request.files) {
        response.send('Upload a Docx File to Convert into PDF!');
        return;
    }
    let random = Math.random();
    let randomNumber = Math.floor(100000 + random * 900000);

    try {
        docxConverter(request.files[0].path, `assets/convert_pdf/${randomNumber}.pdf`, function (err, result) {
            console.log('File Converted Sucessfully');
            response.sendFile(path.join(__dirname, 'assets/convert_pdf/' + randomNumber + '.pdf'));
        });

    } catch (error) {
        console.log('This is the error:\n' + error);
    }
});

