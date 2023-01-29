const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    include: [{ model: ProductTag }, { model: Product }]
  }).then((data) => {
    res.json(data);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findAll({
    include: [{ model: ProductTag }, { model: Product }],
    where: { id: req.params.id }
  }).then((data) => {
    if (!res.body) {
      res.status(404).json({ message: `We did not find a Tag with ID ${req.params.id}. Please find a valid Tag ID and try again!` });
      return; 
    }
    res.json(data);
  });
});

router.post('/', (req, res) => {
  // create a new tag
  console.log(req.body);
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((newTag) => {
      res.json(newTag);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {
      // All the fields you can update and the data attached to the request body.
      tag_name: req.body.tag_name,
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
      res.json("message: Tag Name has been updated");
    })
    .catch((err) => res.json(err));
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: { id: req.params.id },
  })
  .then((deletedTag) => {
    if (deletedTag === 0) {
      res.status(404).json({ message: `No rows were affected for  Tag ID ${req.params.id} . Please check your Tag ID and try again!` });
      return; 
    }
    res.json({message: `${deletedTag} record has been deleted using a Tag ID ${req.params.id}.`});
  })
  .catch((err) => res.json(err));
});

module.exports = router;
