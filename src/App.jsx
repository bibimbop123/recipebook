import { useState } from "react";
import "./App.css";
import chef from "./assets/chef.gif";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";

export default function App() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const perPage = 4;

  const offset = currentPage * perPage;
  const currentRecipes = allRecipes.slice(offset, offset + perPage);
  const pageCount = Math.ceil(allRecipes.length / perPage);

  async function getRecipes() {
    if (!query.trim()) {
      setError("Please enter a valid search term.");
      return;
    }

    setLoading(true);
    setError("");
    setAllRecipes([]);

    try {
      const url = `http://localhost:8080/api/recipes`;
      console.log("🔎 Requesting:", url, "query:", query);

      const response = await axios.get(url, {
        params: { query },
      });

      if (!Array.isArray(response.data)) {
        console.warn("⚠️ Unexpected API response:", response.data);
        setError("Unexpected response format from server.");
        return;
      }

      if (response.data.length === 0) {
        setError("No recipes found. Try another ingredient.");
      }

      setAllRecipes(response.data);
      setCurrentPage(0);
    } catch (err) {
      console.error("❌ Error fetching recipes:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function handlePageClick({ selected }) {
    setCurrentPage(selected);
  }

  function handleSearch() {
    getRecipes();
  }

  return (
    <div className="App">
      <br />
      <h1>Brian's Recipe Book</h1>
      <br />
      <img
        className="chef"
        src={chef}
        alt="chef"
        style={{ animation: "pulse 2s infinite" }}
      />
      <br />
      <p>Search for recipes by ingredient</p>

      <input
        className="search-bar"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <br />
      <button className="search-button" onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>

      {error && <p className="error-message">{error}</p>}

      <br />
      <h3>There are many free recipe sources not behind a paywall</h3>
      <h4>BBC Good Food, Bon Appetit, All Recipes, Food Network, and more!</h4>
      <h6>Privacy: A few sources require payment for access.</h6>

      <div className="recipes">
        <Row>
          {Array.isArray(currentRecipes) && currentRecipes.length > 0 ? (
            currentRecipes.map((recipeData, index) => {
              const recipe = recipeData.recipe;
              return (
                <Col key={index} xs={12} sm={6} md={6} lg={3}>
                  <Card className="recipe-card">
                    <Card.Img variant="top" src={recipe.image} />
                    <Card.Body>
                      <Card.Title>{recipe.label}</Card.Title>
                      <Card.Text>Source: {recipe.source}</Card.Text>
                      <Card.Text>
                        Cuisine: {recipe.cuisineType?.join(", ") || "N/A"}
                      </Card.Text>
                      <Card.Text>
                        Meal Type: {recipe.mealType?.join(", ") || "N/A"}
                      </Card.Text>
                      <Card.Text>Time: {recipe.totalTime} minutes</Card.Text>
                      <Card.Text>Servings: {Math.round(recipe.yield)}</Card.Text>
                      <Card.Text>Calories: {Math.round(recipe.calories)}</Card.Text>
                      <Card.Text>
                        <ul>
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient.text}</li>
                          ))}
                        </ul>
                      </Card.Text>
                      <a href={recipe.url} target="_blank" rel="noreferrer">
                        View Recipe
                      </a>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            !loading &&
            !error && (
              <Col>
                <p style={{ textAlign: "center" }}>No recipes to display yet.</p>
              </Col>
            )
          )}
        </Row>
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"previousButton"}
          nextLinkClassName={"nextButton"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
          forcePage={currentPage}
        />
      )}
    </div>
  );
}
