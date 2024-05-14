import utils from "./starter";

function WeatherList({ weather }) {
  if (
    !weather ||
    !weather.time ||
    !weather.temperature_2m_max ||
    !weather.temperature_2m_min ||
    !weather.weathercode
  ) {
    // If weather data is not fully available, return a loading indicator
    return;
  }

  const { time, temperature_2m_max, temperature_2m_min, weathercode } = weather;

  const renderedWeather = temperature_2m_max.map((maxTemp, index) => {
    const formattedDate = utils.formatDay(time[index]);

    const minTempFloor = Math.floor(temperature_2m_min[index]);
    const maxTempCeiled = Math.ceil(maxTemp);

    const weatherIcon = utils.getWeatherIcon(weathercode[index]); // Assuming you have an array named weathercode containing the weather codes for each day

    return (
      <li key={index} className="day">
        <span>{weatherIcon}</span>
        <p>{formattedDate}</p>
        <p>
          {minTempFloor}° — <strong>{maxTempCeiled}°</strong>
        </p>
      </li>
    );
  });

  return <ul className="weather">{renderedWeather}</ul>;
}

export default WeatherList;
