import React, { Component } from "react";
import photo from "./recipePhotos/default.jpg";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../AppProvider";
import axios from "axios";
import "../styles/ReadRecipe.css";

export default class RecipeRead extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.recipe.title,
      ingredients: this.props.recipe.ingredients,
      instructions: this.props.recipe.instructions,
      categories: this.props.recipe.category,
      created: null,
      isLoaded: false
    };
  }
  /**
   * Retrieves the recipes that the loggedIn user has created
   */
  getUsersRecipies() {
    axios
      .post("http://localhost:4000/api/user/getUserInfo", {
        email: this.context.user.email
      })
      .then(res => res.request.response)
      .then(res => {
        var result = JSON.parse(res).data;
        console.log(result);
        this.setState({
          created: result.created,
          isLoaded: true
        });
      });
  }

  componentDidMount() {
    if (this.context.isLoggedIn) {
      this.getUsersRecipies();
    }
  }

  render() {
    if (this.context.isLoggedIn && !this.state.isLoaded)
      return <div>Loading...</div>;
    return (
      <div>
        <div>
          <img src={photo} width="450px" alt="logo" />
        </div>
        <div>
          <h2>{this.state.title}</h2>
        </div>
        <div>
          <b>Ingredients: </b>
          <p>{this.state.ingredients}</p>
        </div>
        <div>
          <b>Instructions: </b>
          <p>{this.state.instructions}</p>
        </div>
        <div>
          <b>Categories: </b>
          {this.state.categories.map(cat => (
            <p key={cat._id}>{cat.label}</p>
          ))}
        </div>
        <div id="wrapper">
          <div id="back">
            <Button variant="primary">
              <Link to="/" style={{ color: "white" }}>
                Back
              </Link>
            </Button>
          </div>
          <div id="update">
            <AppContext.Consumer>
              {context => {
                //Allows the recipe to be updated if you created the recipe
                if (context.isLoggedIn) {
                  if (this.state.created.includes(this.props.recipe._id)) {
                    return (
                      <div>
                        <Button variant="primary">
                          <Link to={`/update/${this.props.recipe._id}`}>
                            Update
                          </Link>
                        </Button>
                      </div>
                    );
                  }
                }
              }}
            </AppContext.Consumer>
          </div>
        </div>
      </div>
    );
  }
}

RecipeRead.contextType = AppContext;
