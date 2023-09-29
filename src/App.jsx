import { useEffect, useState } from "react";
import "./App.css";
import chef from "./assets/chef.gif";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import Pagination from "./Pagination";

// const arr = [0,1,2,3,4]

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, _] = useState(4);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecord, indexOfLastRecord);
  const numberOfPages = Math.ceil(recipes.length / recordsPerPage);
  // const pageCount = 12 / perPage;
  // console.log({
  //   recipes,
  //   query,
  // });
  // useEffect(() => {
  //   getRecipes();
  // }, [currentPage]);

  async function getRecipes() {
    try {
      // const from = currentPage * perPage;
      // const to = from + perPage;

      const response = await axios.post(
        `https://api.edamam.com/search?q=${query}&app_id=${
          import.meta.env.VITE_REACT_APP_ID
        }&app_key=${import.meta.env.VITE_REACT_APP_KEY}`
      );
      console.log(response);
      const { hits } = response.data;

      setRecipes(hits);
    } catch (error) {
      console.log("Error fetching recipes:", error);
    }
  }

  function handlePageClick({ selected }) {
    setCurrentPage(selected);
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
                      {recipe.recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient.text}</li>
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
      {/* {recipes && (
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
        />
      )} */}
      <Pagination
        numberOfPages={numberOfPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
