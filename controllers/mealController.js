const Meal = require('../models/meal');
const cloudinary = require('../middlewares/cloudinaryConfig');
const { findMealById } = require('../middlewares/helpers');

module.exports = {
  async allMeal(req, res) {
    try {
      const allMeal = await Meal.find({});

      if (allMeal.length) {
        return res.status(200).json({
          success: true,
          data: allMeal,
          message: 'Fetched all meal successfully',
        });
      }

      return res.status(200).json({
        success: true,
        data: [],
        message: 'Meal catalog is empty',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  async addMeal(req, res) {
    let { name, price, available } = req.body;
    try {
      let image = null;
      if (!req.file) {
        image = req.imagepath;
      } else {
        image = req.file.path;
      }

      const returnImage = await cloudinary.v2.uploader.upload(image);

      const data = await new Meal({
        name,
        price,
        available,
        image: returnImage.secure_url,
      });

      await data.save();

      return res.status(201).json({
        success: true,
        message: 'Food added successfully',
        data,
      });
    } catch (err) {
      return res.status(500).json({
        message: err,
        success: false,
      });
    }
  },
  getSingleFood: async (req, res) => {
    const { id } = req.params;

    try {
      const data = await findMealById(req, res, id);

      return res.status(200).json({
        success: true,
        data,
        message: 'Fetched successfully',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
  updateFood: async (req, res) => {
    const { id } = req.params;
    try {
      const oldData = await findMealById(req, res, id);
      let image = null;
      if (!req.file) {
        image = req.imagepath;
      } else {
        image = req.file.path;
      }

      const returnImage = await cloudinary.uploader.upload(image);

      const data = await Meal.findByIdAndUpdate(id, {
        name: req.body.name || oldData.name,
        price: req.body.price || oldData.price,
        image: returnImage.secure_url || oldData.image,
        available: req.body.available || oldData.available,
      });

      await data.save();

      return res.status(201).json({
        success: true,
        status: 201,
        message: 'Food updated successfully',
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },

  deleteFood: async (req, res) => {
    const { id } = req.params;
    try {
      await findMealById(req, res, id);

      await Meal.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'Food Deleted successfully',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
};
