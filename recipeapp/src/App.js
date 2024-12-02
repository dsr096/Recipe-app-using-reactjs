import React, { useState, useEffect } from "react";
import "./App.css";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [recipeInput, setRecipeInput] = useState({
    id: null,
    title: "",
    ingredients: "",
    instructions: "",
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Load recipes from local storage on mount
  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    setRecipes(savedRecipes);
  }, []);

  // Save recipes to local storage on change
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  // Add or edit a recipe
  const handleSaveRecipe = () => {
    if (!recipeInput.title || !recipeInput.ingredients || !recipeInput.instructions) {
      alert("All fields are required!");
      return;
    }

    if (recipeInput.id) {
      // Editing existing recipe
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeInput.id
            ? { ...recipe, ...recipeInput }
            : recipe
        )
      );
    } else {
      // Adding new recipe
      const newRecipe = {
        ...recipeInput,
        id: Date.now(),
      };
      setRecipes([...recipes, newRecipe]);
    }

    setRecipeInput({ id: null, title: "", ingredients: "", instructions: "" });
    setShowForm(false);
  };

  // Delete a recipe
  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
    if (selectedRecipe?.id === id) setSelectedRecipe(null);
  };

  // Open recipe for editing
  const handleEditRecipe = (recipe) => {
    setRecipeInput(recipe);
    setShowForm(true);
  };

  // Open recipe details view
  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Search for recipes
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Recipe App</h1>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setShowForm(true)}>
          <FaPlus /> Add Recipe
        </button>
      </div>

      <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <div className="recipe-item" key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.ingredients.slice(0, 50)}...</p>
            <div className="actions">
              <button onClick={() => handleViewRecipe(recipe)}>
                View
              </button>
              <button onClick={() => handleEditRecipe(recipe)}>
                <FaEdit /> Edit
              </button>
              <button onClick={() => handleDeleteRecipe(recipe.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
        {filteredRecipes.length === 0 && <p>No recipes found.</p>}
      </div>

      {selectedRecipe && (
        <div className="recipe-details">
          <h2>{selectedRecipe.title}</h2>
          <h4>Ingredients:</h4>
          <p>{selectedRecipe.ingredients}</p>
          <h4>Instructions:</h4>
          <p>{selectedRecipe.instructions}</p>
          <button onClick={() => setSelectedRecipe(null)}>Close</button>
        </div>
      )}

      {showForm && (
        <div className="recipe-form">
          <h2>{recipeInput.id ? "Edit Recipe" : "Add Recipe"}</h2>
          <input
            type="text"
            placeholder="Title"
            value={recipeInput.title}
            onChange={(e) => setRecipeInput({ ...recipeInput, title: e.target.value })}
          />
          <textarea
            placeholder="Ingredients (separate with commas)"
            value={recipeInput.ingredients}
            onChange={(e) => setRecipeInput({ ...recipeInput, ingredients: e.target.value })}
          ></textarea>
          <textarea
            placeholder="Instructions"
            value={recipeInput.instructions}
            onChange={(e) => setRecipeInput({ ...recipeInput, instructions: e.target.value })}
          ></textarea>
          <button onClick={handleSaveRecipe}>
            {recipeInput.id ? "Update Recipe" : "Add Recipe"}
          </button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
