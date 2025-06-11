import React, { useEffect, useState } from "react";
import { fetchCities, addCity, updateCity, deleteCity } from "../api";

export default function CityManagement() {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: "",
    places: "",
    description: "",
    pricePerPerson: "",
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
    };

    if (editId) {
      await updateCity(editId, cityData);
      setEditId(null);
    } else {
      await addCity(cityData); // ✅ changed from createCity
    }
    setForm({ name: "", places: "", description: "", pricePerPerson: "" });
    loadCities();
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure to delete this city?")) {
      await deleteCity(id);
      loadCities();
    }
  }

  function handleEdit(city) {
    setEditId(city._id);
    setForm({
      name: city.name,
      places: city.places.join(", "),
      description: city.description,
      pricePerPerson: city.pricePerPerson,
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{editId ? "Edit City" : "Add City"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="City Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: 10, padding: 5 }}
        />
        <input
          name="places"
          placeholder="Places (comma separated)"
          value={form.places}
          onChange={handleChange}
          required
          style={{ marginRight: 10, padding: 5, width: 300 }}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ marginRight: 10, padding: 5, width: 300 }}
        />
        <input
          name="pricePerPerson"
          type="number"
          placeholder="Price per Person"
          value={form.pricePerPerson}
          onChange={handleChange}
          required
          style={{ marginRight: 10, padding: 5 }}
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
              });
            }}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Cities List</h3>
      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Places</th>
            <th>Description</th>
            <th>Price Per Person</th>
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
                <button onClick={() => handleEdit(city)}>Edit</button>
                <button
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
