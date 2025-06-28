import { platform } from "os";

const message = "Die Plattform ist ";

function main() {
    console.log(message + platform())
}

main();