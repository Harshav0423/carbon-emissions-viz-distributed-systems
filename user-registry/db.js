const pg = require("pg");
const dotenv = require("dotenv")


dotenv.config();
const pool = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	ssl: true,
};
const client = new pg.Client(pool);
client.connect((err) => {
	if (err) throw err;
	else {
		queryDatabase();
	}
});

function queryDatabase() {
	const query = `select * from usersds;`;
	client.query(query).then((res) => {
		console.log("Table created successfully and has", res.rowCount, " rows.");
		// client.end(console.log('Closed client connection'));
	});
}

module.exports = { query: (text, params) => client.query(text, params) };
