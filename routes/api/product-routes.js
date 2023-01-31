const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Returning all Products
router.get('/', (req, res) => {
  Product.findAll({
    include: [{ model: ProductTag }, { model: Tag }, { model: Category }] // joining all 4 tables together
  }).then((data) => {
    res.json(data);
  });
});

// Returning a single product by ID
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  Product.findAll({
    include: [{ model: ProductTag }, { model: Tag }, { model: Category }], // joining all 4 tables together
    where: { id: req.params.id }
  }).then((data) => {
    //Messaging back to user if no product ID was found
    if (data.length == 0) {
      res.status(404).json({ message: `We did not find a Product with ID ${req.params.id}. Please find a valid Product ID and try again!` });
      return;
    }
    res.json(data);
  });
});

// API to create a new Product
router.post('/', (req, res) => {
  // Validation to make sure required feilds for product table are present and advises which is missing.
  if (req.body.product_name === undefined && req.body.price === undefined) {
    res.status(404).json({ message: `We did not find see product_name or price passed in the body. Please revise the body and try again!` });
    return;
  };
  if (req.body.product_name === undefined) {
    res.status(404).json({ message: `We did not find see a product_name passed in the body. Please revise the body and try again!` });
    return;
  };
  if (req.body.price === undefined) {
    res.status(404).json({ message: `We did not find see a price passed in the body. Please revise the body and try again!` });
    return;
  };
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Updating a product by its `id` value
router.put('/:id', (req, res) => {
  Product.update(
    {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tagIds: req.body.tagIds,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((product) => {
      if (product == 0) {
        //If 0 rows are affected, advising to user that no match was found
        res.status(404).json({ message: `Failure to update any records. Please find a valid product ID and try again!` });
        return;
      }
      //more than 0 rows are affected, advising success and how many.
      if (product > 0) {
        res.status(200).json({ message: `Sucussfully updated ${product} record(s).` });
        ;
      }
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
    });
});

// delete one product by its `id` value
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: { id: req.params.id },
  })
    .then((deletedProduct) => {
      //Messaging to user that no rows were affected by delete.
      if (deletedProduct === 0) {
        res.status(404).json({ message: `No rows were affected with category with ID . Please check your category ID and try again!` });
        return;
      }
      res.json({ message: `${deletedProduct} record has been deleted using a Category ID ${req.params.id}.` });
    })
    .catch((err) => res.json(err));
});

module.exports = router;


