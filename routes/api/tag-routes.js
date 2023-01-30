const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Returning all Tags
router.get('/', (req, res) => {
  Tag.findAll({
    include: [{ model: ProductTag }, { model: Product }] // joining the tag, product and ProductTag tables together
  }).then((data) => {
    res.json(data);
  });
});

// Returning a single Tag by ID
router.get('/:id', (req, res) => {
  Tag.findAll({
    include: [{ model: ProductTag }, { model: Product }], // joining the tag, product and ProductTag tables together
    where: { id: req.params.id }
  }).then((data) => {
    //Messaging back to user if no Tag ID was found
    if (!res.body) {
      res.status(404).json({ message: `We did not find a Tag with ID ${req.params.id}. Please find a valid Tag ID and try again!` });
      return;
    }
    res.json(data);
  });
});

// API to create a new Tag
router.post('/', (req, res) => {
  // Validation that the tag_name was passed in the body and if not will notify user.
  if (req.body.tag_name === undefined) {
    res.status(404).json({ message: `We did not find see a tag_name passed in the body. Please review the body and try again!` });
    return;
  }
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

// Updating a tag by its `id` value
router.put('/:id', (req, res) => {
  // Validation that the tag_name was passed in the body and if not will notify user. 
  if (req.body.tag_name === undefined) {
    res.status(404).json({ message: `We did not see tag_name passed in the body. Please review the body and try again!` });
    return;
  }
  Tag.update(
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedTag) => {
      //If 0 rows are affected, advising to user that no match was found
      if (updatedTag == 0) { //This is returning a object type, so will not strickly equals, so made it truthy
        res.status(404).json({ message: `No records were modified with this put request for id ${req.params.id}. Please check your id, and updated name and try again!` });
        return;
      };
      res.json({ message: "Catergory Name has been updated" });
    })
    .catch((err) => res.json(err));
});

// Delete a category by its `id` value
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: { id: req.params.id },
  })
    .then((deletedTag) => {
      //Messaging to user that no rows were affected by delete.
      if (deletedTag === 0) {
        res.status(404).json({ message: `No rows were affected for  Tag ID ${req.params.id} . Please check your Tag ID and try again!` });
        return;
      }
      res.json({ message: `${deletedTag} record has been deleted using a Tag ID ${req.params.id}.` });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
