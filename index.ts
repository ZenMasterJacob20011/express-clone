import http = require("node:http");
import {IncomingMessage, ServerResponse} from "node:http";

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    let serverData = ""
    req.on("data", (chunk) => {
        switch (req.method) {
            case "GET":
                console.log("SOMEONE HAS MADE GET REQUEST");
                res.end();
                break;
            case "POST":
                console.log("SOMEONE HAS MADE POST REQUEST");
                console.log(chunk.toString());
                serverData += chunk;
                break;
            default:
                res.writeHead(404, "");
                res.end();
        }
    }).on("end", () => {
        // console.log(serverData);
    })
    res.end();
});
server.listen(3000);

server.on("connection", function (e) {
    console.log("Someone connected");
});

server.on("listening", function () {
    console.log("server has started listening");
});