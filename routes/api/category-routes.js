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
  if(req.body.category_name === undefined){
    res.status(404).json({ message: `We did not find see a category_name passed in the body. Please review the body and try again!` });
    return;
  }
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
  if(req.body.category_name === undefined){
    res.status(404).json({ message: `We did not see category_name passed in the body. Please review the body and try again!` });
    return;
  }
  Category.update(
    {
      // All the fields you can update and the data attached to the request body.
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((data) => {
      // console.log (typeof data);
      if (data == 0 ) { //This is returning a object type, so will not strickly equals, so made it truthy
        res.status(404).json({ message: `We did not find a category with ID ${req.params.id}. Please find a valid category ID and try again!` });
        return; 
      };
      res.json({message: "Catergory Name has been updated"});
    })
    .catch((err) => res.json(err));
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: { id: req.params.id },
  })
    .then((deletedCategory) => {
      if (deletedCategory === 0) {
        res.status(404).json({ message: `No rows were affected with nd a category with ID . Please check your category ID and try again!` });
        return; 
      }
      res.json({message: `${deletedCategory} record has been deleted using a Catergory ID ${req.params.id}.`});
    })
    .catch((err) => res.json(err));
});

module.exports = router;
