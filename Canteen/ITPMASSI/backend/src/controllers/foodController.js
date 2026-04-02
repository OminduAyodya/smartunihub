const FoodItem = require("../models/FoodItem");

const getFoods = async (req, res, next) => {
  try {
    const { canteen } = req.query;
    
    let query = {};
    if (canteen) {
      query.canteen = canteen;
    }
    
    const foods = await FoodItem.find(query).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

const addFood = async (req, res, next) => {
  try {
    const { name, price, image, inStock, canteen } = req.body;

    if (!name || price === undefined || !canteen) {
      return res.status(400).json({ message: "name, price, and canteen are required" });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ message: "Price must be zero or positive" });
    }

    if (!["anohana", "basement"].includes(canteen)) {
      return res.status(400).json({ message: "Invalid canteen. Must be 'anohana' or 'basement'" });
    }

    const food = await FoodItem.create({
      name,
      price: Number(price),
      image: image || undefined,
      inStock: typeof inStock === "boolean" ? inStock : true,
      canteen,
    });

    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
};

const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, image, inStock } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({ message: "Price must be zero or positive" });
      }
      updateData.price = Number(price);
    }
    if (image !== undefined) updateData.image = image;
    if (inStock !== undefined) {
      if (typeof inStock !== "boolean") {
        return res.status(400).json({ message: "inStock must be a boolean" });
      }
      updateData.inStock = inStock;
    }

    const updatedFood = await FoodItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json(updatedFood);
  } catch (error) {
    next(error);
  }
};

const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedFood = await FoodItem.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Keep updateFoodStock for backward compatibility
const updateFoodStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { inStock } = req.body;

    if (typeof inStock !== "boolean") {
      return res.status(400).json({ message: "Valid inStock value is required" });
    }

    const updatedFood = await FoodItem.findByIdAndUpdate(
      id,
      { inStock },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json(updatedFood);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFoods,
  addFood,
  updateFood,
  updateFoodStock,
  deleteFood,
};
