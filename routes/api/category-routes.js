const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: [{ model: Product }]
  }).then((data) => {
    res.json(data);
  });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  console.log(req.params.id)
  Category.findAll({
    include: [{ model: Product }],
    where: { id: req.params.id }
  }).then((data) => {
    if (!res.body) {
      res.status(404).json({ message: `We did not find a category with ID ${req.params.id}. Please find a valid category ID and try again!` });
      return; 
    }
    res.json(data);
  });
});

router.post('/', (req, res) => {
  // create a new category
  console.log(req.body);
  Category.create({
    category_name: req.body.category_name,
  })
    .then((newCategory) => {
      res.json(newCategory);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(
    {
      // All the fields you can update and the data attached to the request body.
      category_name: req.body.category_name,
    },
    {
      // Gets the books based on the isbn given in the request parameters
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedTag) => {
      // Sends the updated book as a json response
      res.json("message: Catergory Name has been updated");
    })
    .catch((err) => res.json(err));
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: { id: req.params.id },
  })
    .then((deletedCategory) => {
      res.json(deletedCategory);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
