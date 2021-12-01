const app = require("./index");

const connect = require("./configs/db");

app.listen(3001, async() => {
    await connect();
    console.log("Listening port: 3001");
});