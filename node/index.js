const express = require('express');
const app = express();
const port = 3000;
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

const mysql = require('mysql');

app.get('/', async (_, res) => {
  const allPeople = await query('SELECT * FROM people');

  var html = `<h1>Hello, World!<h1>\n
  <ul>
    ${allPeople.map(people => `<li>${people.name}</li>`).join('')}
  </ul>`;


  res.send(html);
});

async function createAndInserPeople() {
  await query(`CREATE TABLE IF NOT EXISTS people(id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY(id))`);
  await query(`INSERT INTO people(name) values('Renan Teixeira')`);
}

async function query(sql) {
  const connection = mysql.createConnection(config);

  const queryPromise = new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  })

  const queryResults = await queryPromise;

  connection.end();
  return queryResults;
}

const listenApp = async () => {
  await createAndInserPeople();

  return app.listen(port, () => {
    console.log(`Running at port ${port}`);
  });
}

listenApp();