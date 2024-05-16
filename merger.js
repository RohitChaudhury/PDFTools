// This is to merge pdf's, i.e, code of the pdf-merger-js

// const PDFMerger = require('pdf-merger-js');
// var merger = new PDFMerger(); //Not working because pdf-merger-js is installed in ES6 module, used dynamic import of the module in merge_pdf method

const merge_pdf = async (pdf_1, pdf_2) => {
    const PDFMerger = await import('pdf-merger-js');
    const merger = new PDFMerger.default();
    await merger.add(pdf_1);
    await merger.add(pdf_2);

    // to generate random Number and save it as file name -
    let random = Math.random();
    let randomNumber = Math.floor(100000 + random * 900000);

    await merger.save('assets/merge_pdf/' + randomNumber + '.pdf');

    return randomNumber;
};

module.exports = merge_pdf;