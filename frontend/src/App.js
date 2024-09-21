import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [media, setMedia] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rental, setRental] = useState({
    rentalTime: '',
    rentalDays: 1,
  });

  // Fetching cars from Strapi
  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:1337/api/cars?populate=*");
      console.log("Car Data:", response.data.data); // Log the car data to verify the structure
      setCars(response.data.data);
      setFilteredCars(response.data.data); 
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Fetching car details
  const fetchCarDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:1337/api/cars/${id}?populate=reviews,media`);
      console.log("Car Details:", response.data.data);  // Log the car details
      setSelectedCar(response.data.data);
      setReviews(response.data.data.attributes.reviews.data);
      setMedia(response.data.data.attributes.media.data); // Set media from Strapi
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Handle rental
  const handleRental = async (carId) => {
    try {
      await axios.post('http://localhost:1337/api/rentals', {
        car: carId,
        rentalTime: rental.rentalTime,
        rentalDays: rental.rentalDays,
      });
      alert('Rental confirmed!');
    } catch (error) {
      console.error('Error making rental:', error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilteredCars(
      cars.filter((car) =>
        car.attributes.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className="container mt-4" style={{ marginTop: '200px' }}>
      <h1 className="text-center mb-4">Car Rental App</h1>

      {/* Search form */}
      <form className="form-inline my-2 my-lg-0 mb-4 d-flex" onSubmit={handleSearch}>
        <input
          className="form-control mr-2"
          type="search"
          name="search"
          placeholder="Search cars..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      {/* Car list */}
      <ul className="list-group mb-4">
        {filteredCars.map((car) => {
          const imageUrl = car.attributes.image?.data?.attributes?.url 
            ? `http://localhost:1337${car.attributes.image.data.attributes.url}`
            : null; // Generating image URL if image exists

          return (
            <li
              key={car.id}
              className="list-group-item d-flex align-items-center"
              onClick={() => fetchCarDetails(car.id)}
            >
              {car.attributes.Name}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={car.attributes.Name}
                  className="img-fluid ml-3"
                  style={{ width: '100px', marginLeft: '10px' }}
                />
              ) : (
                <p>No image available</p>
              )}
              <span className="text-info ml-3">Click to view details</span>
            </li>
          );
        })}
      </ul>

      {/* Car details */}
      {selectedCar && (
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title">{selectedCar.attributes.Name}</h2>
            <p className="card-text">{selectedCar.attributes.Descriptions[0]?.children[0]?.text || 'No description'}</p>

            {/* Reviews */}
            <h3>Reviews</h3>
            {reviews.length > 0 ? (
              <ul className="list-group">
                {reviews.map((review) => (
                  <li className="list-group-item" key={review.id}>
                    <strong>{review.attributes.rating}/5</strong> - {review.attributes.comment}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet</p>
            )}

            {/* Rental Form */}
            <div className="mt-4">
              <h3>Make a Rental Reservation</h3>
              <input
                type="datetime-local"
                className="form-control mb-2"
                value={rental.rentalTime}
                onChange={(e) =>
                  setRental({ ...rental, rentalTime: e.target.value })
                }
              />
              <input
                type="number"
                className="form-control mb-2"
                min="1"
                value={rental.rentalDays}
                onChange={(e) =>
                  setRental({ ...rental, rentalDays: e.target.value })
                }
              />
              <button
                className="btn btn-success"
                onClick={() => handleRental(selectedCar.id)}
              >
                Book Rental
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter subscription */}
      <div className="mt-4">
        <h3>Subscribe to our Newsletter</h3>
        <form>
          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Your email"
              aria-label="Your email"
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="submit">Subscribe</button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Gallery */}
      <h3>Media Gallery</h3>
      {media.length > 0 ? (
        <div id="carouselExampleControls" className="carousel slide mb-5" data-bs-ride="carousel">
          <div className="carousel-inner">
            {media.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img
                  src={`http://localhost:1337${image.attributes.url}`}
                  alt={`Media ${index + 1}`}
                  className="d-block w-100"
                  style={{ height: '500px', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" href="#carouselExampleControls" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" href="#carouselExampleControls" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      ) : (
        <p>No media available</p>
      )}
    </div>
  );
};

export default App;
