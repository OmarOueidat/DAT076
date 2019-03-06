import React, { Component /*, Modal, Button */ } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import logo from "./logo.svg";

import "bootstrap/dist/css/bootstrap.min.css";

import RecipeList from "./component/recipe-list.component";
import EditRecipe from "./component/edit-recipe.component";
import CreateRecipe from "./component/create-recipe.component.js";
import Login from "./component/login.component";
import RecipeRead from "./component/read-recipe.component";
import Sidebar from "./component/sidebar.component";

class App extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      modalShow: false,
      isShowing: false,
      recipe: null,
      filter: [],
      activeStyle: ""
    };

    this.showRecipe = this.showRecipe.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }

  showRecipe(recipe) {
    this.setState({
      isShowing: true,
      recipe: recipe
    });
  }

  setFilter(category) {
    let index = this.state.filter.indexOf(category);
    if (index > -1) {
      this.state.filter.splice(index, 1);
    } else {
      this.setState(prevVal => ({
        filter: [...prevVal.filter, category]
      }));
    }
  }

  showMenu() {
    this.state.activeStyle === ""
      ? this.setState({ activeStyle: "active" })
      : this.setState({ activeStyle: "" });
  }

  render() {
    let cats = ["Kött", "Kyckling", "Fisk", "Vegetariskt", "Vegan"];
    //let modalClose = () => this.setState({ modalShow: false });
    return (
      <Router>
        <div className="nopadding">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/" target="_blank">
              <img src={logo} width="30" height="30" alt="RecipeList" />
            </a>
            <Link to="/" className="navbar-brand">
              Recipe Site
            </Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">
                    Recipes
                  </Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">
                    Create Recipe
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    id="sidebarCollapse"
                    className="btn btn-info"
                    onClick={this.showMenu}
                  >
                    <i className="fas fa-align-left" />
                    <span>Toggle Sidebar</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
          <div>
            <div className="wrapper">
              <nav
                id="sidebar"
                ref="sidebar"
                className={this.state.activeStyle}
              >
                <div className="sidebar-header">
                  <h3>Kategorier</h3>
                </div>
                <ul className="list-unstyled components">
                  {cats.map(cat => (
                    <li key={cat} onClick={this.setFilter(cat)}>
                      <div className="filter-item">{cat}</div>
                    </li>
                  ))}
                </ul>
              </nav>
              <div id="content">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                  <div className="container-fluid">
                    <Route
                      path="/"
                      exact
                      render={props => <RecipeList method={this.showRecipe} />}
                    />
                    <Route path="/edit/:id" component={EditRecipe} />
                    <Route path="/create" component={CreateRecipe} />
                    <Route path="/login" component={Login} />
                    <Route
                      path="/recipe"
                      render={props => (
                        <RecipeRead recipe={this.state.recipe} />
                      )}
                    />
                  </div>
                </nav>
              </div>
            </div>
            <style>
              {`
            .wrapper {
              display: flex;
              align-items: stretch;
            }

            #sidebar {
              min-width: 250px;
              max-width: 250px;
              min-height: 100vh;
              background: #e0e0e0;
              color: #fff;
              transition: all 0.3s;
            }

            #sidebar.active {
              margin-left: -250px;
            }

            @media (max-width: 768px) {
              #sidebar {
                margin-left: -250px;
              }

              #sidebar.active {
                margin-left: 0;
              }
            }

            p {
              font-size: 1em;
              font-weight: 300;
              line-height: 1.7em;
              color: #999;
            }

            a,
            a:hover,
            a:focus {
              color: inherit;
              text-decoration: none;
              transition: all 0.3s;
            }

            #sidebar .sidebar-header {
              padding: 20px;
              background: #e0e0e0;
            }

            #sidebar ul p {
              color: #fff;
              padding: 10px;
            }

            #sidebar ul li div {
              padding: 10px;
              font-size: 1.1em;
              display: block;
            }
            #sidebar ul li div:hover {
              color: #aaaaaa;
              background: #fff;
            }
          `}
            </style>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
