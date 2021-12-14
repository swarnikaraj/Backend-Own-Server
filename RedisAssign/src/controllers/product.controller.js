const express = require('express');
const router = express.Router();
const redis = require('../configs/redis');


const Product = require('../models/product.model');

router.get('/', (req, res) => {

    redis.get('products', async(err, products) => {

        if (err) console.log(err);
        if (products) return res.status(200).send({ "cached_products": JSON.parse(products) });

        try {
            const products = await Product.find().lean().exec();

            redis.set("products", JSON.stringify(products));

            return res.status(200).send({ 'db_products': products });

        } catch (err) {
            return res.status(500).send({ message: err.message, status: 'Failed' });
        }
    });
});


router.get('/:id', (req, res) => {
    redis.get(`products.${req.params.id}`, async(err, product) => {
        if (err) console.log(err);

        if (product) return res.status(200).send({ "cached_product": JSON.parse(product) });

        try {
            const product = await Product.findById(req.params.id).lean().exec();

            if (product) {
                redis.set(`products.${req.params.id}`, JSON.stringify(product));
            }

            return res.status(200).send({ 'db_product': product });

        } catch (err) {
            return res.status(500).send({ message: err.message, status: 'Failed' });
        }
    });
});


router.post('/', async(req, res) => {

    try {

        const product = await Product.create(req.body);

        redis.set(`products.${product._id}`, JSON.stringify(product));

        const allProducts = await Product.find().lean().exec();

        redis.set('products', JSON.stringify(allProducts));

        return res.status(201).send(product);

    } catch (err) {
        return res.status(500).send({ message: err.message, status: 'Failed' });
    }

});


router.patch('/:id', async(req, res) => {

    try {

        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();

        redis.set(`products.${product._id}`, JSON.stringify(product));

        const allProducts = await Product.find().lean().exec();

        redis.set('products', JSON.stringify(allProducts));

        return res.send(product);

    } catch (err) {
        return res.status(500).send({ message: err.message, status: 'Failed' });
    }

});

router.delete('/:id', async(req, res) => {

    try {

        const product = await Product.findByIdAndDelete(req.params.id).lean().exec();

        redis.del(`products.${product._id}`);

        const allProducts = await Product.find().lean().exec();

        redis.set('products', JSON.stringify(allProducts));

        return res.send(product);

    } catch (err) {
        return res.status(500).send({ message: err.message, status: 'Failed' });
    }

});


module.exports = router;