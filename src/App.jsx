import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("chicken");

  async function getRecipes() {
    try {
      const response = await axios.post("/api/recipes", { query });
      console.log(response);
      console.log(response.data.hits);
      setRecipes(response.data.hits); // Set recipes to the hits array
      console.log("recipes", recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }

  useEffect(() => {
    getRecipes();
  }, []);

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    console.log("searched");
    setQuery(search);
    setSearch("");
  };

  return (
    <div className="App">
      <form onSubmit={getSearch} className="search-form">
        <input
          className="search-bar"
          type="text"
          value={search}
          onChange={updateSearch}
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>
      <div className="recipes">
        {recipes.map((recipe) => (
          <h1 key={recipe.recipe.label}>{recipe.recipe.label}</h1>
        ))}
      </div>
    </div>
  );
}

export default App;
