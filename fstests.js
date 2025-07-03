const fs = require("fs");

function main() {
    const obj = {
        "first_name": "Vardan",
        "last_name": "Hovsepyan",
        "age": 13,
        "tumo_student": true
    };

    fs.writeFileSync("obj.json", JSON.stringify(obj));
}

main();