var express = require('express');
const compression = require('compression');

const app = express();

app.use(compression());
app.use(express.static("./dist/ijahtesting"));

app.get("/*", function(req, res) {
  res.sendFile("index.html", {root: "dist/ijahtesting/"}
);
});

app.listen(process.env.PORT || 8080);
