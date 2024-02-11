import http from "node:http";

const req = http.request({
    port: 3000,
    host: "localhost",
    method: "POST"
}, res => {
    res.on("data", (chunk) => {
        console.log(chunk);
    })
})

req.write(JSON.stringify({
    name: "Jacob",
    DOB: "4/4/2001"
}));
req.end();