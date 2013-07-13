#!/usr/bin/env node

/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
/* rest.get(apiurl).on('complete', response2console); 
from market_research.js */
 
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";


/* Check if file exists and return a string of the file. Default encoding will be utf-8 */
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};


/* Load the HTML file once read from the file system */
var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};


/* Load the checks file once read from the file system. We directly assumed it conforms to the JSON syntax */
var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};


/* The first $ is a global variable, the second $ is a shortcut for the function jQuery() which looks for the given string "selector" 
in the DOM and returns a jQuery object that references those elements. The function does the following:

 1- load the HTML file
 2- load the checks file and sorts it
 3- create an empty dictionary
 4- loop over all the items from the checks file to search them in DOM provided the item is not an empty string.
    A question arises here, if one by mitsake leaves a blank line that contains only one space in the checks file,
    will it be condsidered as an element to check? 
 5- once the elment is found, it will be added to the dictionary
 6- return the dictionary */

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};


/*I don't know what's with the commander package, didn't read yet. Why a clone of the function? */
var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};


/* Main */
if(require.main == module) {
    program
        .option('-c, --checks <checks_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .parse(process.argv);
    /* interesting that commander returns the --optionName as a property of the object */
    var checkJson = checkHtmlFile(program.file, program.checks);
    /* note that streams get the .toString() function but JSON objects get the .stringify() function. Need to know the other 2 args */
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    /* if not the main program, then this package can be required in the code .. Python does not need this else statement! */
    exports.checkHtmlFile = checkHtmlFile;
}
