import { useState } from "react";
import "./App.css";
import chef from "./assets/chef.gif";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";

function App() {
  const [recipes, setRecipes] = useState([]);
  // const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  console.log({
    recipes,
    query,
  });

  async function getRecipes() {
    const response = await axios.post(
      `https://api.edamam.com/search?q=${query}&app_id=${(import.meta.env.VITE_REACT_APP_ID =
        "d7584277")}&app_key=${(import.meta.env.VITE_REACT_APP_KEY =
        "4389e6c366bbdf3cc67ae920c653110e")}&from=0&to=12`
    );
    const { hits } = await response.data;

    setRecipes(hits);
  }

  return (
    <div className="App">
      <br />
      <h1>Brian's Recipe Book </h1>
      <br />
      <img
        className="chef"
        src={chef}
        alt="chef"
        style={{ animation: "pulse 2s infinite" }}
      />
      <br />
      <br />
      <p>Search for recipes by ingredient</p>
      <input
        className="search-bar"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <br />
      <button
        className="search-button"
        onClick={() => {
          getRecipes();
          setQuery("");
        }}
      >
        Search
      </button>
      <br />
      <div className="recipes">
        <Row>
          {recipes &&
            recipes.map((recipe, index) => (
              <Col key={index} xs={12} sm={6} md={6} lg={3}>
                <Card className="recipe-card">
                  <Card.Img variant="top" src={recipe.recipe.image} />
                  <Card.Body>
                    <Card.Title>{recipe.recipe.label}</Card.Title>
                    <Card.Text>
                      Source: {recipe.recipe.source} <br />
                    </Card.Text>
                    <Card.Text>
                      Calories: {Math.round(recipe.recipe.calories)}
                    </Card.Text>
                    <Card.Text>
                      {recipe.recipe.ingredientLines.map((ingredient) => (
                        <li key={ingredient.text}>{ingredient}</li>
                      ))}
                    </Card.Text>
                    <a
                      href={recipe.recipe.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Recipe
                    </a>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
}

export default App;
