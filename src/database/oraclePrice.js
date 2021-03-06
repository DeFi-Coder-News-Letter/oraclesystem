const SqliteDB = require('./sqlite.js').SqliteDB;
const file = 'oraclePrice.db';
const sqliteDB = new SqliteDB(file);

function initDB() {
  sqliteDB.createTable(`CREATE TABLE IF NOT EXISTS exchangePrice(
		id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        exchange CHAR(32),
        currency CHAR(32),
		price VARCHAR(64),
        endSign BLOB,
		timestamp INTEGER
        );`);

  sqliteDB.createTable(`CREATE TABLE IF NOT EXISTS feedPrice(
		id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        exchange CHAR(32),
        currency CHAR(32),
		price VARCHAR(64),
		timestamp INTEGER
        );`);

  sqliteDB.createTable(`CREATE TABLE IF NOT EXISTS lendfMePrice(
		id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        asset CHAR(42),
        currency CHAR(32),
		price VARCHAR(64),
		timestamp INTEGER
        );`);
  console.log('initDB finished!');
}

function insertTable(table, insertData, insertField) {

  table = table.toString();

  // eslint-disable-next-line eqeqeq
  if (insertData[0].constructor != Array) {
    console.log('insertData type error!!');
    return;
  }

  if (!Array.isArray(insertField)) {
    console.log('insertField type error!!');
    return;
  }

  if (insertField.length === 0 || insertData[0].length !== insertField.length) {
    console.log('parameter length does not match!!');
    return;
  }
  // eslint-disable-next-line max-len
  const str = (10 ** insertField.length).toLocaleString().replace(/,/g, '').slice(1).replace(/0/g, '?').split('').toString();
  const insertSql = `INSERT INTO ${table}(${insertField.toString()}) VALUES(${str})`;
  sqliteDB.insertData(insertSql, insertData);
}

function insertExchangePrice(insertData, insertField = []) {
  insertField = insertField.length === 0 ? ['exchange', 'currency', 'price', 'endSign', 'timestamp'] : insertField;
  insertTable('exchangePrice', insertData, insertField);
}

function insertFeedPrice(insertData, insertField = []) {
  insertField = insertField.length === 0 ? ['exchange', 'currency', 'price', 'timestamp'] : insertField;
  insertTable('feedPrice', insertData, insertField);
}

function insertLendfMePrice(insertData, insertField = []) {
  insertField = insertField.length === 0 ? ['asset', 'currency', 'price', 'timestamp'] : insertField;
  insertTable('lendfMePrice', insertData, insertField);
}

function getExchangePrice(currency = '') {
  const query = `SELECT * FROM exchangePrice WHERE endSign = true AND timestamp \
= (SELECT max(timestamp) FROM exchangePrice) ${currency ? 'AND currency = "' + currency + '"' : ''}`;
  return new Promise(resolve => {
    sqliteDB.queryData(query, result => {
      resolve(result);
    });
  });
}

function getFeedPrice(currency = '') {
  const query = `SELECT max(id),* FROM feedPrice ${currency ? 'WHERE currency = "' + currency + '"' : ''}`;
  return new Promise(resolve => {
    sqliteDB.queryData(query, result => {
      resolve(result);
    });
  });
}

function getLendfMePrice(asset = '') {
  const query = `SELECT max(id),* FROM lendfMePrice ${asset ? 'WHERE asset = "' + asset + '"' : ''}`;
  return new Promise(resolve => {
    sqliteDB.queryData(query, result => {
      resolve(result);
    });
  });
}

function cleanDatabase(num = 200) {
  let sql = `DELETE FROM exchangePrice WHERE id NOT IN (SELECT id FROM exchangePrice \
ORDER BY timestamp DESC LIMIT ${num})`;
  sqliteDB.executeSql(sql);
  sql = `DELETE FROM feedPrice WHERE id NOT IN (SELECT id FROM feedPrice ORDER BY id DESC LIMIT ${num})`;
  sqliteDB.executeSql(sql);
  sql = `DELETE FROM lendfMePrice WHERE id NOT IN (SELECT id FROM lendfMePrice ORDER BY id DESC LIMIT ${num})`;
  sqliteDB.executeSql(sql);
}

module.exports = {
  cleanDatabase,
  getExchangePrice,
  getFeedPrice,
  getLendfMePrice,
  initDB,
  insertExchangePrice,
  insertFeedPrice,
  insertLendfMePrice,
  insertTable,
};
