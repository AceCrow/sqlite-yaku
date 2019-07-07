
OPEN_CREATE = 1;
OPEN_READONLY = 2;
OPEN_READWRITE = 4;

class Database {

    constructor(file, mode) {
        this.sqlite3 = require('sqlite3').verbose();
        let realmode = 0;
        if (mode >= OPEN_READWRITE) {
            realmode = realmode | this.sqlite3.OPEN_READWRITE;
            mode = mode - OPEN_READWRITE;
        }
        if (mode >= OPEN_READONLY) {
            realmode = realmode | this.sqlite3.OPEN_READONLY;
            mode = mode - OPEN_READONLY;
        }
        if (mode >= OPEN_CREATE) {
            realmode = realmode | this.sqlite3.OPEN_CREATE;
            mode = mode - OPEN_CREATE;
        }
        if (!realmode) {
            realmode = undefined;
        }
        this.Database = new this.sqlite3.Database(file, realmode, (err) => {
            if (err) {
                throw err;
            }
        });
    }

    run(sql, binds) {
        return new Promise((resolve, reject) => {
            this.Database.run(sql, binds, function(error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(this.changes);
                }
            });
        });
    };

    get(sql, binds) {
        return new Promise((resolve, reject) => {
            this.Database.get(sql, binds, (error, row) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(row);
                }
            });
        });
    };

    all(sql, binds) {
        return new Promise((resolve, reject) => {
            this.Database.all(sql, binds, (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    each(sql, binds, func) {
        return new Promise((resolve, reject) => {
            this.Database.each(
                sql,
                binds,
                (error, item) => {
                    func(item);
                },
                (error, rowAmount) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(rowAmount);
                    }
                }
            );
        });
    };

    exec(sql) {
        return new Promise((resolve, reject) => {
            this.Database.exec(sql, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    };

    close() {
        return new Promise((resolve, reject)=> {
            this.Database.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    };
}

// TODO: implement.
class Statement {
    constructor() {
        this.dummy = 0;
    }
}

module.exports = {
    Database,
    Statement,
    OPEN_READONLY,
    OPEN_READWRITE,
    OPEN_CREATE
};
