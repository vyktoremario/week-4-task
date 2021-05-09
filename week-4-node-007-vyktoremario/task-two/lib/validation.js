"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = __importDefault(require("dns"));
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const path_1 = __importDefault(require("path"));
/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
function validateEmailAddresses(inputPath, outputFile) {
    // console.log('Complete the implementation in src/validation.ts');
    inputPath.forEach((file) => {
        const filePath = path_1.default.join(__dirname, '..', file);
        const rl = readline_1.default.createInterface({
            input: fs_1.default.createReadStream(filePath, 'utf8'),
            output: process.stdout,
            terminal: false,
        });
        rl.on('line', (line) => {
            const value = JSON.parse(JSON.stringify(line));
            if (value !== undefined) {
                if (validateMail(value)) {
                    const domain = value.split('@')[1];
                    dns_1.default.resolve(domain, 'MX', (err, addresses) => {
                        if (err) {
                            console.log('Error');
                        }
                        else if (addresses && addresses.length > 0) {
                            console.log('Mail as valid.');
                            // domainArr.push(value)
                            fs_1.default.appendFileSync(outputFile, `${JSON.stringify(value)}\n`);
                        }
                    });
                }
            }
        });
    });
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
exports.default = validateEmailAddresses;
