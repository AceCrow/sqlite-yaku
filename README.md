# sqlite-yaku
A wrapper for the NodeJS sqlite library. It is meant to make the API easier to use.

## Database connection
There are three types of database that can be created and connected to.
1. A permanent on-disk database (file).
2. A temporary on-disk database (file).
3. A temporary in-memory database.

Each type can be created as follows:


    const yaku = require('./sqlite-yaku');
    const dbPermanent = new yaku.Database('filepath.db');
    const dbTemporary = new yaku.Database(''); // Empty string
    const dbInMemory = new yaku.Database(':memory:');

It is also possible to specify a certain mode when opening the database connection. One or more of `yaku.OPEN_READONLY`, `yaku.OPEN_READWRITE` and `yaku.OPEN_CREATE` may be specified. The default value is `OPEN_READWRITE | OPEN_CREATE`.
    
## Database.run(sql, [param])

Runs the SQL query with the specified parameters. The function returns a promise that resolves information based on the query that was passed.
* An INSERT query will resolve the amount of records that were inserted.
* A DELETE query will resolve the amount of records that were deleted.
* etc.

The array of parameters will be bound to the SQL query before execution. It is also possible to instead pass an object and include named parameters in the query. Named parameters start with `$`, `:` or `@`.
Example:

      // Directly in the function arguments.
      db.run("UPDATE tbl SET name = ? WHERE id = ?", "bar", 2);

      // As an array.
      db.run("UPDATE tbl SET name = ? WHERE id = ?", [ "bar", 2 ]);

      // As an object with named parameters.
      db.run("UPDATE tbl SET name = $name WHERE id = $id", {
          $id: 2,
          $name: "bar"
      });
      
## Database.get(sql, [param])

Runs the SQL query with the specified parameters. The function returns a promise that resolves the first result row that matches the query. If the result set is empty the promise will resolve undefined.

## Database.all(sql, [param])

Runs the SQL query with the specified parameters. The function returns a promise that resolves all result rows that match the query. If the result set is empty the promise will resolve an empty array. For queries that have potentially large result sets, `Database.each()` could be used.

## Database.each(sql, [param], function)

Runs the SQL query with the specified parameters and calls the given function once for each result row. The function returns a promise that will resolve the amount of rows once the given function has completed for all rows. If the query only returns a limited number of rows, it might be more convenient to use `Database.all()`.

## Database.exec(sql)

Runs all SQL queries in the supplied string. If a query fails, no subsequent statements will be executed. Should a query fail all previous queries will **not** be rolled back. The function returns a promise that resolves once all queries have been completed. `Database.exec()` will only execute statements up to the first NULL byte. **Comments are not allowed**.


    

