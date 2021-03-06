const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4000;
const mongoose = require("mongoose");
const User = require("./user.model");
const Recipe = require("./recipe.model");
const Category = require("./category.model");
const recipeRoutes = express.Router();
const userRoutes = express.Router();
const categoryRoutes = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb://recipe-user:recipe-password@cluster0-shard-00-00-tky9f.mongodb.net:27017,cluster0-shard-00-01-tky9f.mongodb.net:27017,cluster0-shard-00-02-tky9f.mongodb.net:27017/recipe-db?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
  {
    useNewUrlParser: true
  }
);
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established succesfully");
});

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

userRoutes.get("/users", (req, res) => {
  User.find((error, data) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, data: data });
  })
})

userRoutes.post("/getUserInfo", (req, res) => {
  User.findOne({ email: req.body.email }, (error, result) => {
    if (error) {
      return res.json({ success: false, error: error });
    }
    return res.json({ success: true, data: result });
  });
});

userRoutes.post("/update", (req, res) => {
  const { email, name, password } = req.body;
  User.findOneAndUpdate(
    { email: email },
    { name: name, password: password },
    error => {
      if (error) return res.json({ success: false, error: error });
      return res.json({ success: true });
    }
  );
});

userRoutes.post("/addSavedRecipe", (req, res) => {
  const { _id, email } = req.body;
  User.findOneAndUpdate({ email: email }, { $push: { saved: _id } }, error => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true });
  });
});

userRoutes.post("/addCreatedRecipe", (req, res) => {
  const { _id, email } = req.body;
  User.findOneAndUpdate(
    { email: email },
    { $push: { created: _id } },
    error => {
      if (error) return res.json({ success: false, error: error });
      return res.json({ success: true });
    }
  );
});

userRoutes.post("/deleteSavedRecipe", (req, res) => {
  const { _id, email } = req.body;
  User.findOneAndUpdate({ email: email }, { $pull: { saved: _id } }, error => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true });
  });
});

userRoutes.post("/deleteCreatedRecipe", (req, res) => {
  const { _id, email } = req.body;
  User.findOneAndUpdate(
    { email: email },
    { $pull: { created: _id } },
    error => {
      if (error) return res.json({ success: false, error: error });
      return res.json({ success: true });
    }
  );
});

userRoutes.post("/add", (req, res) => {
  User.findOne({ email: req.body.email }, (err, result) => {
    if (result === null) {
      let user = new User();
      user.id = req.body.id;
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;

      user.save(error => {
        if (error) return res.json({ success: false, error: error });
        return res.json({ success: true });
      });
    } else {
      return res.json({
        success: false,
        message: "Email already exists"
      });
    }
  });
});

userRoutes.post("/deleteUser", (req, res) => {
  const { email } = req.body;
  User.findOneAndDelete({ email: email }, error => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true });
  });
});

userRoutes.post("/get", async (req, res) => {
  User.findOne({ email: req.body.email }, (err, result) => {
    if (err) throw err;
    if (result === null) {
      return res.json({
        success: false,
        message: "Username or password incorrect"
      });
    } else if (
      result.password === req.body.password &&
      result.password !== undefined &&
      req.body.password !== undefined
    ) {
      return res.json({ success: true, name: result.name });
    } else {
      return res.json({ success: false });
    }
  });
});

recipeRoutes.post("/add", (req, res) => {
  let recipe = new Recipe();
  recipe.id = req.body.id;
  recipe.title = req.body.title;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;
  recipe.category = req.body.category;

  recipe.save((error, result) => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true, data: { _id: result._id }, result: result });
  });
});

recipeRoutes.post("/delete", (req, res) => {
  const { _id } = req.body;
  Recipe.findByIdAndDelete(_id, error => {
    if (error) return res.json({ success: false, error: error });
    return res.json({ success: true });
  });
});

recipeRoutes.get("/recipes", (req, res) => {
  Recipe.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

recipeRoutes.get("/getRecipe", (req, res) => {
  const { id } = req.body;
  Recipe.findById(id, function (err, data) {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, recipe: data });
  });
});

recipeRoutes.post("/getRecipeById", (req, res) => {
  Recipe.findOne({ _id: req.body._id }, (error, result) => {
    if (error) {
      return res.json({ success: false, error: error });
    }
    return res.json({ success: true, data: result });
  });
});

recipeRoutes.post("/update", (req, res) => {
  const { _id, title, ingredients, instructions, category } = req.body;
  Recipe.findOneAndUpdate(
    { _id: _id },
    {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      category: category
    },
    error => {
      if (error) return res.json({ success: false, error: error });
      return res.json({ success: true });
    }
  );
});

/*
recipeRoutes.post("/add", (req, res) => {
    let recipe = new Recipe();
    recipe.id = req.body.id;
    recipe.title = req.body.title;
    recipe.ingredients = req.body.ingredients;
    recipe.instructions = req.body.instructions;
    recipe.category = req.body.category;

    recipe.save((error, result) => {
        if (error) return res.json({ success: false, error: error });
        return res.json({ success: true, data: { _id: result._id } });
    });
});


recipeRoutes.post("/update", (req, res) => {
    Recipe.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title: req.body.title,
                ingredients: req.body.ingredients,
                instructions: req.body.instructions
            }
        },
        (error, result) => {
            if (error) return res.json({ success: false, error: error });
            return res.json({ success: true, data: result });
        }
    );
});
*/

categoryRoutes.get("/categories", (req, res) => {
  Category.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});
app.use("/api/recipe", recipeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
