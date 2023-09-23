import { useState } from "react";
function App() {
  const [recipes, setRecipes] = useState([]);
  // const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  console.log({
    recipes,
    query,
  });

  async function getRecipes() {
    const response = await fetch(
      `https://api.edamam.com/search?q=${query}&app_id=${
        import.meta.env.VITE_REACT_APP_ID
      }&app_key=${import.meta.env.VITE_REACT_APP_KEY}`
    );
    const { hits } = await response.json();

    setRecipes(hits);
  }

  return (
    <div className="App">
      <input
        className="search-bar"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="search-button"
        onClick={() => {
          getRecipes();
          setQuery("");
        }}
      >
        Search
      </button>
      <div className="recipes">
        {recipes.map((recipe) => (
          <h1 key={recipe.recipe.label}>{recipe.recipe.label}</h1>
        ))}
      </div>
    </div>
  );
}

export default App;
