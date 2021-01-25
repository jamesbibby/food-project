const { resolve } = require('path');
const conn = require('./dbconnection');

/**
 *  model class for a Food object
 */
class Food {
  /**
   *
   * @param {number} id the database id for the food
   * @param {string} name a name for the food
   * @param {number} servingSize the serving size (in servingSizeUnits)
   * @param {string} servingSizeUnits a string describing the units of the serving size
   * @param {number} calories in kilocalories
   * @param {number} carbs in grams
   * @param {number} protein in grams
   * @param {number} fat in grams
   * @param {number} salt in grams
   * @param {number} sugar in grams
   */
  constructor(
    id,
    name,
    servingSize,
    servingSizeUnits,
    calories,
    carbs,
    protein,
    fat,
    salt,
    sugar
  ) {
    this.id = id;
    this.name = name;
    this.servingSize = servingSize;
    this.servingSizeUnits = servingSizeUnits;
    this.calories = calories;
    this.carbs = carbs;
    this.protein = protein;
    this.fat = fat;
    this.salt = salt;
    this.sugar = sugar;
  }

  /**
   * Creates an instance from a database row
   * @param {Object} row a row from the food table
   */
  static fromDBRow(row) {
    return new Food(
      row.id,
      row.name,
      row.serving_size,
      row.serving_size_units,
      row.calories,
      row.carbs,
      row.protein,
      row.fat,
      row.salt,
      row.sugar
    );
  }
}

/**
 * Get a food from the database by id
 * @param {number} id the id for the food to retrieve
 * @returns {Promise<Food>} a promise to the Food object
 */
async function getFood(id) {
  return new Promise((resolve, reject) => {
    conn.query('select * from foods where id = ?', [id], (err, results) => {
      if (err) throw err;
      if (results.length != 1) {
        throw new Error(`Unable to find food with id ${req.params.id}`);
      }
      const row = results[0];
      const food = Food.fromDBRow(row);
      resolve(food);
    });
  });
}

/**
 * Update a food in the database by id
 * @param {number} id the id to update
 * @param {Object} values a submitted form body
 * @returns {Promise<Food>} a promise to the updated Food object
 */
async function updateFood(id, values) {
  return new Promise((resolve, reject) => {
    conn.query(
      'update foods set name = ?, serving_size = ?, serving_size_units = ?, calories = ?, protein = ?, fat = ?, salt = ?, sugar = ? where id = ?',
      [
        values.name,
        parseFloat(values.serving_size),
        values.serving_size_units,
        parseFloat(values.calories),
        parseFloat(values.protein),
        parseFloat(values.fat),
        parseFloat(values.salt),
        parseFloat(values.sugar),
        parseInt(id),
      ],
      (err, results) => {
        if (err) {
          throw err;
        }
        resolve(results.affectedRows);
      }
    );
  }).then((affectedRows) => {
    if (affectedRows != 1) {
      throw new Error(
        `Expected affected rows to be 1 but it was ${results.affectedRows}`
      );
    }
    return getFood(id);
  });
}

/**
 * Adds a new food to the database
 * @param {Object} values a submitted form body
 * @returns {Promise<Food>} a promise to the newly created Food object
 */
async function addFood(values) {
  return new Promise((resolve, reject) => {
    conn.query(
      'insert into foods (name, serving_size, serving_size_units, calories, carbs, protein, fat, salt, sugar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        values.name,
        values.serving_size,
        values.serving_size_units,
        values.calories,
        values.carbs,
        values.protein,
        values.fat,
        values.salt,
        values.sugar,
      ],
      (err, results) => {
        if (err) {
          throw err;
        }
        if (results.affectedRows != 1) {
          throw new Error(
            `Expected affected rows to be 1 but it was ${results.affectedRows}`
          );
        }
        resolve(results.insertId);
      }
    );
  }).then((id) => getFood(id));
}

/**
 * Searches for the given string contained in the name field (case-insensitive)
 * @param {string} searchTerm the term to search for
 * @returns {Promise<Food[]>} a promise to the list of results
 */
async function searchFoods(searchTerm) {
  return new Promise((resolve, reject) => {
    conn.query(
      'select * from foods where name like ?',
      ['%' + searchTerm + '%'],
      (err, results) => {
        if (err) throw err;
        const foodList = [];
        results.forEach((row) => {
          foodList.push(Food.fromDBRow(row));
        });
        resolve(foodList);
      }
    );
  });
}

/**
 * Deletes the given food from the db (by id)
 * @param {number} id the id of the food to delete
 * @returns {Promise<boolean>} a promise indicating whether a row was deleted
 */
async function deleteFood(id) {
  return new Promise((resolve, reject) => {
    conn.query('delete from foods where id = ?', [id], (err, results) => {
      if (err) throw err;
      resolve(results.affectedRows);
    });
  }).then((affectedRows) => {
    if (affectedRows > 1) {
      throw new Error(
        `Expected affected rows to be 1 but it was ${results.affectedRows}`
      );
    }
    return affectedRows == 1;
  });
}

/**
 * Lists all foods in the database
 * @returns {Promise<Food[]>} a promise to the list of foods
 */
async function listFoods() {
  return new Promise((resolve, reject) => {
    conn.query('select * from foods', (err, results) => {
      if (err) throw err;
      const foodList = [];
      results.forEach((row) => {
        foodList.push(Food.fromDBRow(row));
      });
      resolve(foodList);
    });
  });
}

module.exports = {
  getFood,
  updateFood,
  addFood,
  searchFoods,
  deleteFood,
  listFoods,
};
