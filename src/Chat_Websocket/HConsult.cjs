const io = require("socket.io")(3066, {
    cors: {
        origin: "*"
    }
});
io.on("connection", (socket) =>
{
    console.log("clientid:" + socket.id);
});
