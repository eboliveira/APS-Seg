const b64_sha512crypt = require("sha512crypt-node");
const crypto = require("crypto");
const fs = require("fs");

function generateHashPassword(password) {
    const salt = `$6$${genRandomString(8)}`;
    const code = b64_sha512crypt.sha512crypt(password, salt);
    return "$" + code.split("$").slice(4).join("$");
}

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function genRandomString(length) {
    // Gerador de strings aleatórias.
    return crypto.randomBytes(Math.ceil(length/2))
            .toString("hex")
            .slice(0,length);
}

function checkForSequenceChars(string, length) {
    const ascii_lowercase = "abcdefghijklmnopqrstuvwxyz";
    const n = ascii_lowercase.length - length;
    for (let i = 0; i <= n; i++) {
        const seq = [];
        for (let j = i; j < i+length; j++) {
            seq.push(ascii_lowercase[j]);
        }
        const regex = new RegExp(seq.join(""));
        if (regex.test(string)) {
            return true;
        }
    }
    return false;
}

function checkForSequenceNumbers(string, length) {
    const integers = "0123456789";
    const n = integers.length - length;
    for (let i = 0; i <= n; i++) {
        const seq = [];
        for (let j = i; j < i+length; j++) {
            seq.push(integers[j]);
        }
        const regex = new RegExp(seq.join(""));
        if (regex.test(string)) {
            return true;
        }
    }
    return false;
}

function validPassword(password, lengthSeqChars=3, lengthSeqNumbers=3) {
    const res = {
        invalid: false,
        properties: {
            isEmpty: false,
            hasSeqChars: false,
            hasSeqNumbers: false,

            hasNumber: false,
            hasSpecial: false,
            hasLowerCaseChar: false,
            hasUpperCaseChar: false,
        }
    };
    if (typeof password !== "string") {
        res.invalid = true;
        return res;
    }
    res.properties = {
        isEmpty: password === "",
        hasSeqChars: checkForSequenceChars(
            password.toLowerCase(),
            lengthSeqChars
        ),
        hasSeqNumbers: checkForSequenceNumbers(
            password.toLowerCase(),
            lengthSeqNumbers
        ),
        
        hasNumber: /\d/.test(password),
        hasSpecial: /[\W\s]/.test(password),
        hasLowerCaseChar: /[a-z]/.test(password),
        hasUpperCaseChar: /[A-Z]/.test(password),
    };
    
    return res;
}

function sha512(password, salt) {
    // Algoritimo de hash sha512.
    var hash = crypto.createHash("sha512", salt);
    hash.update(password);
    return hash.digest("hex").slice(0, 86);
}


module.exports = {
    deleteFolderRecursive,
    genRandomString,
    checkForSequenceChars,
    checkForSequenceNumbers,
    validPassword,
    sha512,
    generateHashPassword
};