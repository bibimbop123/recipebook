import { useEffect, useState } from "react";
import "./App.css";
import chef from "./assets/chef.gif";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";

export default function App() {
  const [allRecipes, setAllRecipes] = useState([]);  // store all fetched recipes
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // zero-based for ReactPaginate
  const perPage = 4;

  // Calculate total pages dynamically based on number of recipes
  const pageCount = Math.ceil(allRecipes.length / perPage);

  useEffect(() => {
    getRecipes();
  }, []);

  async function getRecipes() {
    try {
      const response = await axios.get("http://localhost:8080/api/recipes", {
        params: {
          query,
        },
      });

      const { data } = response;

      setAllRecipes(data);
      setCurrentPage(0); // reset to first page on new fetch
    } catch (error) {
      console.log("Error fetching recipes:", error);
    }
  }

  // Slice recipes to show only current page items
  const offset = currentPage * perPage;
  const currentRecipes = allRecipes.slice(offset, offset + perPage);

  function handlePageClick({ selected }) {
    setCurrentPage(selected);
  }

  function handleSearch() {
    getRecipes();
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
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
      <br />
      <h3> There are many free recipe sources not behind a paywall</h3>
      <br />
      <h4> BBC Good Food, Bon Appetit, All Recipes, Food Network, and more!</h4>

      <h6>Privacy: A few sources require payment for access.</h6>
      <br />
      <div className="recipes">
        <Row>
          {currentRecipes &&
            currentRecipes.map((recipe, index) => (
              <Col key={index} xs={12} sm={6} md={6} lg={3}>
                <Card className="recipe-card">
                  <Card.Img variant="top" src={recipe.recipe.image} />
                  <Card.Body>
                    <Card.Title>{recipe.recipe.label}</Card.Title>
                    <Card.Text>Source: {recipe.recipe.source} <br /></Card.Text>
                    <Card.Text>Cuisine: {recipe.recipe.cuisineType}</Card.Text>
                    <Card.Text>Meal Type: {recipe.recipe.mealType}</Card.Text>
                    <Card.Text>Time: {recipe.recipe.totalTime} minutes</Card.Text>
                    <Card.Text>Servings: {Math.round(recipe.recipe.yield)}</Card.Text>
                    <Card.Text>Calories: {Math.round(recipe.recipe.calories)}</Card.Text>
                    <Card.Text>
                      <ul>
                        {recipe.recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient.text}</li>
                        ))}
                      </ul>
                    </Card.Text>
                    <a href={recipe.recipe.url} target="_blank" rel="noreferrer">
                      View Recipe
                    </a>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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
