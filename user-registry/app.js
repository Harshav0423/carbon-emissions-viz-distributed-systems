var express = require("express");
var app = express();
var port = 8080;
var host = "0.0.0.0";
var cors = require("cors");
var indexRouter = require("./routes/index");
var userRouter = require("./routes/users");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(port, host, () => {
	console.log(`Running on http://${host}:${port}`);
});

app.use((req, res, next) => {
	console.log("Uses router");
	next();
});

app.use("/", indexRouter);
app.use("/user", userRouter);

module.exports = app;
