import cloudinary from "../config/cloudinary.js";
import { Product } from "../model/productModel.js";

export const uploader = async (req, res) => {
  try {
    const filePath = req.file.path;
    const { url, public_id } = await cloudinary.uploader.upload(filePath);

    const {
      name,
      price, 
      description,
      category,
      stockQuantity,
      epirationDate,
      keywords
    } = req.body;

   
    const keywordsArray = Array.isArray(keywords)
      ? keywords
      : keywords.split(',').map(k => k.trim());


    const priceInKobo = Number(price) * 100;

    const saveToDb = await Product.create({
      name,
      price: priceInKobo, 
      description,
      category,
      stockQuantity: Number(stockQuantity),
      epirationDate,
      imageUrl: url,
      public_id,
      keywords: keywordsArray
    });

    res.status(201).json({
      message: 'Product uploaded successfully',
      product: saveToDb
    });
  } catch (err) {
    res.status(500).json({
      error: 'server error',
      details: err.message,
      action: 'Please try again'
    });
  }
};
