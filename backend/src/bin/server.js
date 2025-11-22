const app = require("../apps/app");



const server = app.listen(port = 3000, (req, res) => {
    console.log("Run in " + port);
});