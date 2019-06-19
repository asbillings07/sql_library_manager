"use strict";
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Title Field is Required"
          }
        }
      },
      author: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Author Field is Required"
          }
        }
      },
      genre: DataTypes.STRING,
      year: DataTypes.INTEGER
    },
    {}
  );
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};

/**
 * "use strict";
const dateFormat = require("dateformat");
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Title is required"
          }
        }
      },
      author: DataTypes.STRING,
      body: DataTypes.TEXT
    },
    {}
  );
  Article.associate = models => {};

  Article.prototype.publishedAt = function() {
    return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
  };
  // a method to get a published at date and time

  Article.prototype.shortDescription = function() {
    return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
  };
  // a method for a short description of the article.
  return Article;
};

 */
