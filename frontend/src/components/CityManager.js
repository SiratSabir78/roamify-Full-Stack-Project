import React, { useEffect, useState } from "react";
import { fetchCities, addCity, updateCity, deleteCity } from "../api";
import './CSS/CityManager.css'
export default function CityManagement() {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: "",
    places: "",
    description: "",
    pricePerPerson: "",
    images: "",
    tripDates: "",
    numberOfPeople: "",
    totalTravelers: "",
    favouritesCount: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadCities();
  }, []);

  async function loadCities() {
    const { data } = await fetchCities();
    setCities(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const cityData = {
      name: form.name,
      places: form.places.split(",").map((p) => p.trim()),
      description: form.description,
      pricePerPerson: Number(form.pricePerPerson),
      images: form.images.split(",").map((url) => url.trim()),
      tripDates: form.tripDates.split(",").map((d) => new Date(d.trim())),
      numberOfPeople: Number(form.numberOfPeople),
      totalTravelers: Number(form.totalTravelers),
      favouritesCount: Number(form.favouritesCount),
    };

    if (editId) {
      await updateCity(editId, cityData);
      setEditId(null);
    } else {
      await addCity(cityData);
    }

    setForm({
      name: "",
      places: "",
      description: "",
      pricePerPerson: "",
      images: "",
      tripDates: "",
      numberOfPeople: "",
      totalTravelers: "",
      favouritesCount: "",
    });
    loadCities();
  }

  function handleEdit(city) {
    setEditId(city._id);
    setForm({
      name: city.name,
      places: city.places.join(", "),
      description: city.description,
      pricePerPerson: city.pricePerPerson,
      images: city.images.join(", "),
      tripDates: Array.isArray(city.tripDates)
        ? city.tripDates
            .filter((d) => typeof d === "string" || d instanceof Date)
            .map((d) => (d ? d.slice?.(0, 10) : ""))
            .join(", ")
        : "",
      numberOfPeople: city.numberOfPeople,
      totalTravelers: city.totalTravelers,
      favouritesCount: city.favouritesCount || 0,
    });
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure to delete this city?")) {
      await deleteCity(id);
      loadCities();
    }
  }

  return (
    <div className="citymanager-container" style={{ padding: 20 }}>
      <h2>{editId ? "Edit City" : "Add City"}</h2>
      <form
        className="citymanager-form"
        onSubmit={handleSubmit}
        style={{ marginBottom: 20 }}
      >
        <input
          name="name"
          placeholder="City Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="places"
          placeholder="Places (comma separated)"
          value={form.places}
          onChange={handleChange}
          required
          style={{ width: 300 }}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ width: 300 }}
        />
        <input
          name="images"
          placeholder="Image URLs (comma separated)"
          value={form.images}
          onChange={handleChange}
          style={{ width: 300 }}
        />
        <input
          name="tripDates"
          placeholder="Trip Dates (yyyy-mm-dd, comma separated)"
          value={form.tripDates}
          onChange={handleChange}
        />
        <input
          name="pricePerPerson"
          type="number"
          placeholder="Price per Person"
          value={form.pricePerPerson}
          onChange={handleChange}
          required
        />
        <input
          name="numberOfPeople"
          type="number"
          placeholder="Number of People"
          value={form.numberOfPeople}
          onChange={handleChange}
        />
        <input
          name="totalTravelers"
          type="number"
          placeholder="Total Travelers"
          value={form.totalTravelers}
          onChange={handleChange}
        />
        <input
          name="favouritesCount"
          type="number"
          placeholder="Favourites Count"
          value={form.favouritesCount}
          onChange={handleChange}
        />

        <button type="submit">{editId ? "Update" : "Add"}</button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({
                name: "",
                places: "",
                description: "",
                pricePerPerson: "",
                images: "",
                tripDates: "",
                numberOfPeople: "",
                totalTravelers: "",
                favouritesCount: "",
              });
            }}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Cities List</h3>
      <table
        className="citymanager-table"
        border="1"
        cellPadding="8"
        cellSpacing="0"
        width="100%"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Places</th>
            <th>Description</th>
            <th>Price</th>
            <th>Trip Dates</th>
            <th>Total Travelers</th>
            <th>Favourites Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city._id}>
              <td>{city.name}</td>
              <td>{city.places.join(", ")}</td>
              <td>{city.description}</td>
              <td>{city.pricePerPerson}</td>
              <td>
                {Array.isArray(city.tripDates)
                  ? city.tripDates
                      .filter((d) => typeof d === "string" || d instanceof Date)
                      .map((d) => (d ? d.slice?.(0, 10) : ""))
                      .join(", ")
                  : ""}
              </td>
              <td>{city.totalTravelers}</td>
              <td>{city.favouritesCount || 0}</td>
              <td>
                <button onClick={() => handleEdit(city)}>Edit</button>
                <button
                  className="delete"
                  onClick={() => handleDelete(city._id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


