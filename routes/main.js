const conn = require('../model/dbconnection');
const {
  searchFoods,
  addFood,
  updateFood,
  getFood,
  deleteFood,
  listFoods,
} = require('../model/food');

module.exports = function (app) {
  /**
   * Renders the Home page
   * inputs: none
   */
  app.get('/', function (req, res) {
    res.render('index', { title: 'Home' });
  });

  /**
   * Renders the About page
   * inputs: none
   */
  app.get('/about', function (req, res) {
    res.render('about', { title: 'About Me' });
  });

  /**
   * Renders the Search Foods page
   * inputs:
   *   query:
   *     s: the search term
   */
  app.get('/food/search', async function (req, res) {
    if (req.query.s) {
      const foodList = await searchFoods(req.query.s);
      console.log(foodList);
      res.render('food_search', {
        title: 'Search',
        foods: foodList,
        s: req.query.s,
      });
    } else {
      res.render('food_search', { title: 'Search' });
    }
  });

  /**
   * Renders the Add a Food page
   * inputs: none
   */
  app.get('/food/add', function (req, res) {
    res.render('food_add', { title: 'Add a Food' });
  });

  /**
   * Handles submission of the add a food form
   * inputs:
   *   body:
   *     - name
   *     - serving_size
   *     - serving_size_units
   *     - calories
   *     - protein
   *     - fat
   *     - carbs
   *     - salt
   *     - sugar
   */
  app.post('/food/add', async function (req, res) {
    const food = await addFood(
      req.body.name,
      req.body.serving_size,
      req.body.serving_size_units,
      req.body.calories,
      req.body.carbs,
      req.body.protein,
      req.body.fat,
      req.body.salt,
      req.body.sugar
    );
    res.render('food_view', {
      title: 'Update',
      food,
      message: 'Successfully added',
    });
  });

  app.get('/food/update/:id', function (req, res) {
    conn.query(
      'select * from foods where id = ?',
      [req.params.id],
      (err, results, fields) => {
        if (err) throw err;
        if (results.length != 1) {
          throw new Error(`Unable to find food with id ${req.params.id}`);
        }
        const row = results[0];
        const food = {
          id: row.id,
          name: row.name,
          servingSize: row.serving_size,
          servingSizeUnits: row.serving_size_units,
          calories: row.calories,
          fat: row.fat,
          protein: row.protein,
          carbs: row.carbs,
          sugar: row.sugar,
          salt: row.salt,
        };
        res.render('food_update', {
          title: 'Update',
          food: food,
          type: 'update',
        });
      }
    );
  });

  /**
   * Handles submission of the update a food form
   * inputs:
   *   params:
   *     - id
   *   body:
   *     - name
   *     - serving_size
   *     - serving_size_units
   *     - calories
   *     - protein
   *     - fat
   *     - carbs
   *     - salt
   *     - sugar
   */
  app.post('/food/update/:id', async function (req, res) {
    const food = await updateFood(req.params.id, req.body);
    res.render('food_view', {
      title: 'Update',
      food,
      message: 'Successfully updated',
    });
  });

  /**
   * Handles deleting a food from the database
   * params:
   *   - id
   */
  app.get('/food/delete/:id', async function (req, res) {
    const result = await deleteFood(req.params.id);
    res.render('delete_food', { result: result });
  });

  /**
   * Handles listing all foods in the database
   * params: none
   */
  app.get('/food/list', async function (req, res) {
    const foodList = await listFoods();
    res.render('food_list', { title: 'View All Foods', foods: foodList });
  });

  /**
   * Gets a single food from the db by id
   * params:
   *   - id
   */
  app.get('/food/view/:id', async function (req, res) {
    const food = await getFood(req.params.id);
    res.render('food_view', { title: 'View', food });
  });
};
