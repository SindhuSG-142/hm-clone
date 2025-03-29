import { ObjectId } from "mongodb";
import { ProductModel }from "../models/products.model.js";
import {PurchaseModel} from "../models/purchased.model.js";

export const postProduct = async (req, res) => {
  const { title, price, image1, image2, category, related_to, rating } = req.body;
  try {
    const product = new ProductModel({
      title,
      price,
      image1,
      image2,
      category,
      related_to,
      rating,
    });
    await product.save();
    res.status(200).send({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal error" });
  }
};

export const getProduct = async (req, res) => {
  const { related_to, sort, order, page, limit, category, q, product, gender } = req.query;

  let filter = {};
  let sortOption = {};
  let pageSkip = (page - 1) * limit;

  if (related_to) {
    if (related_to === "women" || related_to === "men") {
      filter.related_to = related_to;
    } else {
      filter.related_to = { $regex: related_to, $options: "i" };
    }
  }
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }
  if (q) {
    const words = q.split(" ");
    filter.$or = words.map((word) => ({
      $or: [
        { title: { $regex: word, $options: "i" } },
        { category: { $regex: word, $options: "i" } },
        { related_to: { $regex: word, $options: "i" } },
      ],
    }));
  }
  if (product) filter.title = { $regex: product, $options: "i" };
  if (gender) filter.gender = { $regex: gender, $options: "i" };
  if (sort === "price") sortOption.price = order === "asc" ? 1 : -1;
  if (sort === "rating") sortOption.rating = order === "asc" ? 1 : -1;

  try {
    let products = await ProductModel.find(filter).sort(sortOption).skip(pageSkip).limit(parseInt(limit, 10));
    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Internal Error", error });
  }
};

export const findProduct = async (req, res) => {
  const { _id } = req.params;

  try {
    if (_id) {
      const product = await ProductModel.findById(_id);
      return res.status(200).send(product);
    }
    res.status(400).send({ message: "Product ID is required" });
  } catch (error) {
    res.status(500).send({ message: "Internal error" });
  }
};

export const updateProduct = async (req, res) => {
  const { _id } = req.params;
  const { title, price, rating, role } = req.body;

  if (role !== "admin") {
    return res.status(403).send({ message: "Not authorized" });
  }

  try {
    const updateFields = {};
    if (title) updateFields.title = title;
    if (price) updateFields.price = price;
    if (rating) updateFields.rating = rating;

    await ProductModel.findByIdAndUpdate(_id, { $set: updateFields });

    res.status(200).send({ message: "Product updated Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Error" });
  }
};

export const getMany = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).send({ error: "IDs should be an array" });
    }

    const objectIds = ids
      .map((id) => {
        try {
          return new ObjectId(id);
        } catch (e) {
          return null;
        }
      })
      .filter((id) => id !== null);

    const products = await ProductModel.find({ _id: { $in: objectIds } });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: "Internal Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { _id } = req.params;
  const { role } = req.body;

  if (role !== "admin") {
    return res.status(403).send({ message: "Not authorized" });
  }

  try {
    await ProductModel.findByIdAndDelete(_id);
    res.status(200).send({ message: "Product deleted Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Error" });
  }
};

export const postPurchase = async (req, res) => {
  const { ids, user_id } = req.body;

  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({ message: "No valid ids provided" });
    }

    const purchased = await PurchaseModel.findOneAndUpdate(
      { user_id },
      { $addToSet: { ids: { $each: ids } } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!purchased) {
      return res.status(404).send({ message: "Purchase record not found or created" });
    }

    res.status(200).send({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal error" });
  }
};

export const getPurchasedProducts = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).send({ message: "User ID is required" });
  }

  try {
    const purchasedIds = await PurchaseModel.aggregate([
      { $match: { user_id } },
      { $project: { _id: 0, ids: 1 } },
    ]);

    if (!purchasedIds.length || !purchasedIds[0].ids.length) {
      return res.status(404).send({ message: "No products found for the provided user ID" });
    }

    const products = await ProductModel.find({ _id: { $in: purchasedIds[0].ids } });

    if (products.length === 0) {
      return res.status(404).send({ message: "No products found for the provided IDs" });
    }
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal error" });
  }
};

export const getSuggestions = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).send({ message: "Query parameter is required" });
  }

  try {
    const regex = new RegExp(q, "i");

    const suggestions = await ProductModel.find(
      { $or: [{ title: { $regex: regex } }, { category: { $regex: regex } }] },
      { title: 1, category: 1, _id: 1 }
    )
      .limit(10)
      .exec();

    if (suggestions.length === 0) {
      return res.status(404).send({ message: "No suggestions found" });
    }

    res.status(200).send(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).send({ message: "Internal error", error });
  }
};
