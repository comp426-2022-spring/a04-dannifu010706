
"use strict";
const Database = require('better-sqlite3');


const logdb = new Database('log.db');
const stmt = logdb.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`
    );

let row = stmt.get();

if (row === undefined) {

    console.log('Your database appears to be empty. I will initialize it now.');

    const logdata = `
        CREATE TABLE logdata ( remoteaddr VARCHAR, remoteuser VARCHAR, time VARCHAR, method VARCHAR, url VARCHAR, protocol VARCHAR, httpversion NUMERIC, status INTEGER, referer VARCHAR, useragent VARCHAR );
        
    `;

    db.exec(logdata);

    console.log('Your database has been initialized with a new table and two entries containing a username and password.');
} else {

    console.log('Database exists.')
}

module.exports = logdb