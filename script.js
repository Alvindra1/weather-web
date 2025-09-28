async function getWeather() {
  const location = document.getElementById("locationInput").value;
  if (!location) return alert("Enter a location");

  const weatherRes = await fetch(`http://localhost:5000/weather?location=${location}`);
  const data = await weatherRes.json();

  if (data.cod !== 200) {
    alert("Location not found!");
    return;
  }

  const weather = data.weather[0].description;
  const temp = data.main.temp;
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const time = new Date().toLocaleTimeString();

  document.getElementById("weatherCondition").innerText = weather;
  document.getElementById("temperature").innerText = `${temp}°C`;
  document.getElementById("weatherIcon").src = icon;

    document.getElementById("poemOutput").innerText = "Generating~";

  const response = await fetch("http://localhost:5000/generate-poem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, weather, time }),
  });
  const result = await response.json();

  document.getElementById("poemLocation").innerText = location;

  document.getElementById("poemOutput").innerText = result.poem || "Failed to generate poem.";

}
