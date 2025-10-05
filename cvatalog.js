const mongoose = require("mongoose");

async function main() {
  try {
 
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

 
    const variantSchema = new mongoose.Schema({
      color: String,
      size: String,
      stock: Number
    });

    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      category: String,
      variants: [variantSchema]
    });

    const Product = mongoose.model("Product", productSchema);

    
    await Product.deleteMany({});  
    await Product.insertMany([
      {
        name: "T-Shirt",
        price: 499,
        category: "Clothing",
        variants: [
          { color: "Red", size: "M", stock: 50 },
          { color: "Blue", size: "L", stock: 30 }
        ]
      },
      {
        name: "Running Shoes",
        price: 2999,
        category: "Footwear",
        variants: [
          { color: "Black", size: "9", stock: 20 },
          { color: "White", size: "10", stock: 15 }
        ]
      },
      {
        name: "Smartwatch",
        price: 7999,
        category: "Electronics",
        variants: [
          { color: "Black", size: "Standard", stock: 10 }
        ]
      }
    ]);
    console.log("✅ Sample products inserted");
 
    console.log("\n📦 All Products:");
    const allProducts = await Product.find();
    console.log(allProducts);
 
    console.log("\n👕 Clothing Products:");
    const clothingProducts = await Product.find({ category: "Clothing" });
    console.log(clothingProducts);
 
    console.log("\n🎨 Variant Colors and Sizes:");
    const variantsInfo = await Product.find({}, { name: 1, "variants.color": 1, "variants.size": 1 });
    console.log(variantsInfo);
 
    console.log("\n⚫ Products with Black Variant:");
    const blackVariants = await Product.find({ "variants.color": "Black" });
    console.log(blackVariants);
  
    console.log("\n🔄 Updating Stock...");
    await Product.updateOne(
      { name: "Running Shoes", "variants.color": "Black", "variants.size": "9" },
      { $inc: { "variants.$.stock": -5 } }
    );
    const updatedProduct = await Product.find({ name: "Running Shoes" });
    console.log(updatedProduct);

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

main();
