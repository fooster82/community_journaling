const app = require("./server.js")

const port = (process.env.port || 5000);
app.listen(port, () =>{
    console.log(`app listening at https://localhost:${port}`)
});