const express = require('express');
const router = express.Router();
const bodyParser=require('body-parser');
const passport = require('passport');
const User = require('../models/User');
const Product = require('../models/Product');


/* router.post('/', (req, res) => {
    // Request validation
    if(!req.body) {
        
        return res.status(400).send({
            message: "Product content can not be empty"
        });
    }

    // Create a Product
    const product = new Product({
        name: req.body.name || "No product title", 
        price: req.body.price,
        img: req.body.img,
        availableQuantity: req.body.availableQuantity
    });

    // Save Product in the database
    product.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while creating the product."
        });
    });
});
 */

router.get('/', (req,res) =>{
    Product.find()
    .then(products => res.json(products))
    .catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving products."
        });
    });
});

router.post('/', (req, res) => {
    let data = [];
    let _id = null;
    let cart = JSON.parse(req.body.cart);
    console.log('cart:', cart);
    if (!cart) return res.json(data)
    console.log('productc:',data);
    Product.find().exec(function (err, products) {
        console.log('products1',products);
        var n = products.length;
        console.log('length:',n);
        for (var i = 0; i < n; i++) {
            var product = products[i];
            _id = '' + product._id;
            console.log("id:",_id);
            if (cart.hasOwnProperty(_id)) {
              product.qty = cart[_id]
              console.log('cart[i]',cart[_id]);
              console.log('qty:',product.qty)
              data.push(product);
              console.log('data',data);
            }
            
        }
        return res.json(data);
    })
 
  });

router.post('/:productId',(req, res) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });            
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            message: "Something wrong retrieving product with id " + req.params.productId
        });
    });
});


router.put('/:productId',(req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Product content can not be empty"
        });
    }

    // Find and update product with the request body
    Product.findByIdAndUpdate(req.params.productId, {
        name: req.body.name || "No product title", 
        price: req.body.price,
        img: req.body.img,
        availableQuantity: req.body.availableQuantity
    }, {new: true})
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            message: "Something wrong updating note with id " + req.params.productId
        });
    });
});

router.delete('/:productId', (req, res) => {
    Product.findByIdAndRemove(req.params.productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });
        }
        res.send({message: "Product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            message: "Could not delete product with id " + req.params.productId
        });
    });
});
module.exports = router;