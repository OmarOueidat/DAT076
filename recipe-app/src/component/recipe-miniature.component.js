import React, { Component } from "react";
import photo from "./recipePhotos/default.jpg";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../AppProvider";

export default class MiniRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedRecipes: [],
      saved: this.props.saved,
      recipe: {},
      isLoaded: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.showRecipe = this.showRecipe.bind(this);
  }

  /**
   * Opens the recipe and renders the read-recipe.component
   */
  showRecipe() {
    this.props.method(this.props.recipe);
  }
  /**
   * If the recipe is saved, clicking the button removes the saved recipe from the database
   * If the recipe is not saved, clicking adds it to the user in the database
   */
  handleClick() {
    !this.state.saved
      ? axios.post("http://localhost:4000/api/user/addSavedRecipe", {
          email: this.context.user.email,
          _id: this.props.recipe._id
        })
      : axios.post("http://localhost:4000/api/user/deleteSavedRecipe", {
          email: this.context.user.email,
          _id: this.props.recipe._id
        });
    this.setState({ saved: !this.state.saved });
  }

  render() {
    const iconStyles = {
      marginLeft: 180,
      marginTop: -500
    };

    let buttonText = this.state.saved ? "Unsave" : "Save";
    if (!this.context.isLoggedIn) {
      buttonText = "Save";
    }
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={photo} />
        <Card.Body style={{ marginTop: "-30px" }}>
          <Button
            onClick={this.handleClick}
            className="like"
            style={iconStyles}
            disabled={!this.context.isLoggedIn}
          >
            <i className="fa fa-heart" />
            &nbsp;
            {buttonText}
          </Button>

          <Card.Title id="recipeTitle">{this.props.recipe.title}</Card.Title>
          <br />
          <Button onClick={this.showRecipe} variant="primary">
            <Link
              to={`/recipe/${this.props.recipe._id}`}
              style={{ color: "white" }}
            >
              Show Recipe
            </Link>
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

MiniRecipe.contextType = AppContext;
