var db = require("../db");
var bcrypt = require("bcrypt");
const signUp = async (req, res) => {
	const { username, email, password } = req.body;
	console.log({ username, email, password });
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const userExists = await db.query(
		"select email from usersds where email=$1",
		[email]
	);
	if (userExists.rowCount > 0) {
		res.status(401).send({ message: "user already exists" });
		return;
	}
	try {
		console.log({username, email, hash})
		const out = await db.query(
			"insert into usersds(username, email, password) values($1,$2,$3)",
			[username, email, hash]
		);
		const r = await db.query("select * from usersds where email=$1", [email]);
		res.status(201).send({ message: "Successfully created", rows: r.rows[0] });
	} catch {
		res.status(500).send({ message: "something went wrong" });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const out = await db.query("select * from usersds where email=$1", [email]);
	if (out.rowCount == 0) {
		res.status(401).send({ message: "User not found" });
		return;
	}
	try {
		const user = out.rows[0];

		const isUser = await bcrypt.compare(password, user.password);

		if (isUser) {
			res.status(200).send({ message: "Successfully logged in" });
			return;
		} else {
			res.status(400).send({ message: "Incorret password" });
		}
	} catch {
		res.status(500).send({ message: "something went wrong" });
	}
};

module.exports = { signUp, login };
