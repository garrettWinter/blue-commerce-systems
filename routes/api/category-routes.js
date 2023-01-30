const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

  // Returning all categories
router.get('/', (req, res) => {
  Category.findAll({
    include: [{ model: Product }] // joining the category and product tables together
  }).then((data) => {
    res.json(data);
  });
});

  // Returning a single category by ID
router.get('/:id', (req, res) => {
  console.log(req.params.id)
  Category.findAll({
    include: [{ model: Product }], // joining the category and product tables together
    where: { id: req.params.id }
  }).then((data) => {
    //Messaging back to user if no category ID was found
    if (!res.body) {
      res.status(404).json({ message: `We did not find a category with ID ${req.params.id}. Please find a valid category ID and try again!` });
      return; 
    }
    res.json(data);
  });
});

  // API to create a new Category
router.post('/', (req, res) => {
  // Validation that the category_name was passed in the body and if not will notify user.
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

  // Updating a category by its `id` value
router.put('/:id', (req, res) => {
  // Validation that the category_name was passed in the body and if not will notify user. 
  if(req.body.category_name === undefined){
    res.status(404).json({ message: `We did not see category_name passed in the body. Please review the body and try again!` });
    return;
  }
  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((data) => {
      //If 0 rows are affected, advising to user that no match was found
      if (data == 0 ) { //This is returning a object type, so will not strickly equals, so made it truthy
        res.status(404).json({ message: `We did not find a category with ID ${req.params.id}. Please find a valid category ID and try again!` });
        return; 
      };
      res.json({message: "Catergory Name has been updated"});
    })
    .catch((err) => res.json(err));
});

  // delete a category by its `id` value
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: { id: req.params.id },
  })
    .then((deletedCategory) => {
      //Messaging to user that no rows were affected by delete.
      if (deletedCategory === 0) {
        res.status(404).json({ message: `No rows were affected with nd a category with ID . Please check your category ID and try again!` });
        return; 
      }
      res.json({message: `${deletedCategory} record has been deleted using a Catergory ID ${req.params.id}.`});
    })
    .catch((err) => res.json(err));
});

module.exports = router;
