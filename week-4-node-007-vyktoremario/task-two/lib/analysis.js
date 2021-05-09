"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// const glob = require('glob')
/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
// let inputPaths = glob.sync(newPath + '**/*.csv')
// console.log(inputPaths)
function analyseFiles(inputPaths, outputPath) {
    let resultValue = {};
    let value = [];
    inputPaths.forEach((pathFile) => {
        const newPath = path_1.default.resolve(__dirname, '../' + pathFile);
        const data = fs_1.default.readFileSync(newPath, 'utf-8');
        value = JSON.parse(JSON.stringify(data)).split('\n');
        value.pop();
        value.shift();
    });
    const category = {};
    const validEmail = [];
    const domainNames = [];
    for (let index = 0; index < value.length; index++) {
        const item = value[index];
        if (validateMail(value[index])) {
            validEmail.push(item);
            domainNames.push(item.split('@')[1]);
            category[item.split('@')[1]] = (category[item.split('@')[1]] || 0) + 1;
        }
    }
    resultValue = {
        validDomains: Object.keys(category),
        totalEmailsParsed: value.length,
        totalValidEmails: validEmail.length,
        categories: category,
    };
    fs_1.default.writeFileSync(outputPath, JSON.stringify(resultValue, null, 2));
}
function validateMail(str) {
    // check for @
    const atSymbol = str.indexOf('@');
    if (atSymbol < 1)
        return false;
    const dot = str.indexOf('.');
    if (dot <= atSymbol + 2)
        return false;
    // check that the dot is not at the end
    if (dot === str.length - 1)
        return false;
    return true;
}
exports.default = analyseFiles;
