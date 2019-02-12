const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const self = exports.bookshelf = {
  init: function () {
    console.log('Hy I\'m a BookShelf')
    db.run("CREATE TABLE IF NOT EXISTS book (name TEXT, author TEXT)");
  },
  select: function(callback) {
    const result = []
    db.each("SELECT rowid AS id, name, author FROM book", function (err, row) {
      result.push({id: row.id, name: row.name, author: row.author})
    }, function(err, rowsCount) {
      callback(result)
    });    
  },
  insert(book, callback) {
    db.serialize(function () {
      var stmt = db.prepare("INSERT INTO book VALUES (?, ?)");
      stmt.run(book.name, book.author, function (err) {
        if (err) {
          console.error(err);
        }
      });
      stmt.finalize();
      self.select(callback)
    });
  },
  close: function() {
    db.close();
  }
}
