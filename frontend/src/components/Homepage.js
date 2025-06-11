import React from "react";
import "./CSS/Homepage.css";
import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div className="container py-5">
      <div className="row gx-5">
        <div className="col-md-4">
          <div className="card shadow-lg rounded" style={{ height: "100%" }}>
            <img src="/Lahore.jpg" 
              className="card-img-top rounded-top"
              alt="Lahore"
              style={{
                height: "180px",
                objectFit: "cover",
              }}
            />
            <div className="card-body">
              <h5 className="card-title">Name of the city from the database</h5>
              <p className="card-text">Description from the database</p>
              <Link to="/destination" className="btn detailButton">
                See more details!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
