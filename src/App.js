import { useState, useEffect } from "react";
import utils from "./starter";
import WeatherList from "./WeatherList";

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState([]);
  const [city, setCity] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState("");

  useEffect(() => {
    const storedSearchValue = localStorage.getItem("searchValue");
    if (storedSearchValue) {
      setSearch(storedSearchValue);
      getCoutnryInfo(storedSearchValue);
      setLoading(true); // Set loading state to true when fetching weather data
      utils
        .getWeather(storedSearchValue)
        .then((result) => {
          setWeather(result);
          setLoading(false); // Set loading state to false after weather data is fetched
        })
        .catch((error) => {
          console.error(error);
          setError("Error fetching weather data");
          setLoading(false); // Set loading state to false if there's an error
        });
    }
  }, []); // Run only once on component mount

  const hanldeName = async (event) => {
    const searchValue = event.target.value;

    setSearch(searchValue);

    if (searchValue.length > 1) {
      localStorage.setItem("searchValue", searchValue);
      setLoading(true); // Set loading state to true when fetching location information
      try {
        await getCoutnryInfo(searchValue); // Wait for location information to be fetched
        const result = await utils.getWeather(searchValue); // Fetch weather data after location information is available
        setWeather(result);
        setLoading(false); // Set loading state to false after weather data is fetched
        setError("");
      } catch (error) {
        console.error(error);
        setError("Error fetching location information");
        setLoading(false); // Set loading state to false if there's an error
      }
    } else {
      localStorage.setItem("searchValue", ""); // Clear the search value
      setWeather(null); // Reset weather to an empty array
      setCity("");
      setCountryCode("");
    }
  };

  async function getCoutnryInfo(search) {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${search}`
    );
    const geoData = await geoRes.json();

    // Check if geoData.results exists and has elements
    if (geoData.results && geoData.results.length > 0) {
      // Access the first element safely
      setCity(geoData.results[0]?.name);
      setCountryCode(utils.convertToFlag(geoData.results[0]?.country_code));
      setError("");
    } else {
      // Handle the case where geoData.results is empty or undefined
      setError("No Location found");
    }
  }

  // console.log(weather);

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <div>
        <input
          type="text"
          placeholder="Search from location..."
          value={search}
          onChange={hanldeName}
        />
      </div>
      {loading ? ( // Check if loading state is true
        <p className="loader">Loading...</p>
      ) : error ? ( // Check if error state is truthy
        <p className="error">{error}</p>
      ) : (
        // Show weather data when loading state is false and error state is falsy
        weather?.time && (
          <div>
            <h2>
              Weather {city} {countryCode}
            </h2>
            <WeatherList weather={weather} />
          </div>
        )
      )}
    </div>
  );
}

export default App;
