const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: 'sequelizer.sqlite',

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

const Book = sequelize.define('book', {
  name: Sequelize.STRING,
  author: Sequelize.STRING
});

const self = exports.bookshelf = {
  init: function () {
    console.log('Hy I\'m a BookShelf')
    sequelize.sync()
  },
  select: function (callback) {
    Book.findAll({ raw: true }).then(function (books) {
      return callback(null, books);
    }).catch(function (err) {
      return callback(err);
    });

  },
  insert(book, callback) {
    Book
      .create({ name: book.name, author: book.author })
      .then(function () {
        self.select(callback)
      });
  }
}