var express = require('express');
// var app = express.createServer();
const app = express();
app.use(express.static("./dist/ijahtesting"));

app.get("/*", function(req, res) {
  res.sendFile("index.html", {root: "dist/ijahtesting/"}
);
});

app.listen(process.env.PORT || 8080);
