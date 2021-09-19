const io = require("socket.io")(3066, {
    cors: {
        origin: "*"
    }
});
//io.on 只有connection然后返回的socket对象作为后续操作的前提
io.on("connection", (socket) =>
{
    console.log("clientid:" + socket.id);
    socket.on("message", (message) =>
    {
        //发送给io对象下面所有的socket
        // io.emit("receive-message", message);
        //发送给其他所有socket
        socket.broadcast.emit("receive-message", message);
        console.log("原生事件触发的:" + message);
    });
    socket.on("voice-message", (message) =>
    {
        socket.broadcast.emit("receive-voicemessage", message);
    });
});
