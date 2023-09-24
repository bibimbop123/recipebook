import { useState } from "react";
import "./App.css";
import chef from "./assets/chef.gif";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  // const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(4);
  console.log({
    recipes,
    query,
  });

  async function getRecipes() {
    try {
      const response = await axios.post(
        `https://api.edamam.com/search?q=${query}&app_id=${(import.meta.env.VITE_REACT_APP_ID =
          "d7584277")}&app_key=${(import.meta.env.VITE_REACT_APP_KEY =
          "4389e6c366bbdf3cc67ae920c653110e")}&from=${
          currentPage * perPage
        }&to=${(currentPage + 1) * perPage}`
      );
      const { hits } = await response.data;

      setRecipes(hits);
      setCurrentPage(0);
    } catch (error) {
      console.log("Error fetching recipes:", error);
    }
  }
  const handlePageClick = (selected) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * perPage;
  const paginatedData = recipes.slice(offset, offset + perPage);

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
      <h3> Free recipe sources not behind a paywall</h3>
      <br />
      <h4> BBC Good Food, Bon Appetit, All Recipes, Food Network, and more!</h4>

      <h6>Privacy: A few sources require payment for access.</h6>
      <br />
      <div className="recipes">
        <Row>
          {recipes &&
            paginatedData.map((recipe, index) => (
              <Col key={index} xs={12} sm={6} md={6} lg={3}>
                <Card className="recipe-card">
                  <Card.Img variant="top" src={recipe.recipe.image} />
                  <Card.Body>
                    <Card.Title>{recipe.recipe.label}</Card.Title>
                    <Card.Text>
                      Source: {recipe.recipe.source} <br />
                    </Card.Text>
                    <Card.Text>Cuisine: {recipe.recipe.cuisineType}</Card.Text>
                    <Card.Text>Meal Type: {recipe.recipe.mealType}</Card.Text>
                    <Card.Text>
                      Time: {recipe.recipe.totalTime} minutes
                    </Card.Text>
                    <Card.Text>
                      Servings: {Math.round(recipe.recipe.yield)}
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
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={Math.ceil(recipes.length / perPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        previousLinkClassName={"previousButton"}
        nextLinkClassName={"nextButton"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </div>
  );
}
