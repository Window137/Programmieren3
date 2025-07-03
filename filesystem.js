const fs = require("fs");

// function main() {
//     const file = "hello.txt";
//     fs.appendFileSync(file, "Hello world\n");
// }

const dummyText = "Apple yep";

function main() {
    fs.writeFileSync("dummytext.txt", dummyText);
    var text = fs.readFileSync("dummytext.txt").toString();
    console.log(dummyText == text);
    console.log(text);
    fs.writeFileSync(
        "undummytext.txt",
        text.replace("Apple", "Microsoft")
    );
}

main();