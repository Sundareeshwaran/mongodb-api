const RESTAURANT_LIST_API = "http://localhost:3000/api/restaurants";
const CITIES_API = "http://localhost:3000/api/restaurants/cities";
const CITY_API_BASE = "http://localhost:3000/api/restaurants/search";
const SEARCH_API_BASE = "http://localhost:3000/api/restaurants/search/id";

const apiMessage = document.getElementById("apiMessage");
apiMessage.addEventListener("click", () => {
  window.location.reload(true);
});

const getRestaurants = async () => {
  try {
    const response = await fetch(RESTAURANT_LIST_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

const displayRestaurants = async () => {
  const apiMessage = document.getElementById("apiMessage");

  try {
    const restaurantData = await getRestaurants();
    const restaurantList = document.getElementById("restaurantList");
    restaurantList.innerHTML = "";

    apiMessage.innerHTML = `<h1>Welcome to Restaurant Finder</h1>`;
    restaurantData.forEach((restaurant, index) => {
      const li = document.createElement("li");
      li.onclick = async () => {
        const restaurantId = restaurant["Restaurant ID"];
        try {
          const restaurantData = await getRestaurantData(restaurantId);
          console.log(restaurantData["Restaurant Name"], restaurantId);
          window.open(
            `https://www.google.com/search?q=${restaurantData["Restaurant Name"]}+${restaurantData.Locality}+${restaurantData["Locality Verbose"]}`,
            "_blank"
          );
        } catch (error) {
          console.error(`Error fetching data for ${restaurantId}:`, error);
          throw error;
        }
      };
      const ratingColor = restaurant["Rating color"]
        .toLowerCase()
        .replace(/\s+/g, "");

      li.innerHTML = `
        <strong>${index + 1}. ${restaurant["Restaurant Name"]}</strong><br>
        <small>Address: ${restaurant.Address}, ${restaurant.Locality}, ${
        restaurant["Locality Verbose"]
      }</small><br>
        Cuisine: ${restaurant.Cuisines}<br>
        Price Range: ${restaurant["Price range"]}<br>
        Rating: ${
          restaurant["Aggregate rating"]
        } (<span style="color:${ratingColor}; font-weight:600;">${
        restaurant["Rating text"]
      }</span>)<br>
        Votes: ${restaurant.Votes}<br>
      `;
      restaurantList.appendChild(li);
    });
  } catch (error) {
    console.error("Error displaying cities:", error);
  }
};

const getCitiesData = async () => {
  try {
    const response = await fetch(CITIES_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

const getCityData = async (cityName) => {
  try {
    const cityApiUrl = `${CITY_API_BASE}/${cityName}`;
    const response = await fetch(cityApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${cityName}:`, error);
    throw error;
  }
};

const getRestaurantData = async (restaurantId) => {
  try {
    const searchApiUrl = `${SEARCH_API_BASE}/${restaurantId}`;
    const response = await fetch(searchApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${cityName}:`, error);
    throw error;
  }
};

const displayCities = async () => {
  const apiMessage = document.getElementById("apiMessage");
  const cityList = document.getElementById("cityList");
  const restaurantListContainer = document.getElementById("restaurantList");

  try {
    const citiesData = await getCitiesData();
    const cities = citiesData.City;

    apiMessage.innerHTML = `<h1>Welcome to Restaurant Finder</h1>`;
    cityList.innerHTML = "";

    // Add the default "Select the City" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select the City";
    defaultOption.disabled = true; // Disable the default option to prevent selection
    defaultOption.selected = true; // Set it as the selected option
    cityList.appendChild(defaultOption);

    if (cities && Array.isArray(cities)) {
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        cityList.appendChild(option);
      });

      cityList.addEventListener("change", async (event) => {
        const selectedCity = event.target.value;
        if (selectedCity) {
          try {
            const cityData = await getCityData(selectedCity);
            displayCityData(cityData);
            // If a city is selected, we assume you don't want to see the full restaurant list
            restaurantListContainer.innerHTML = ""; // Clear the restaurant list
            apiMessage.innerHTML = `<h1>Restaurants at ${selectedCity}</h1>`;
          } catch (error) {
            apiMessage.innerHTML = `Error: Failed to fetch data for ${selectedCity}. Check console for details.`;
            // Optionally, you might want to display the full restaurant list again if city fetch fails
            // displayRestaurants();
          }
        } else {
          // If "Select the City" is chosen (empty value), display the full restaurant list
          displayRestaurants();
        }
      });

      // Initially display the full restaurant list when the page loads
      displayRestaurants();
    } else {
      console.error("Unexpected API response:", citiesData);
    }
  } catch (error) {
    console.error("Error displaying cities:", error);
    throw error;
  }
};

const displayCityData = (data) => {
  const cityDataContainer = document.getElementById("cityData");
  cityDataContainer.innerHTML = "";

  if (data && Array.isArray(data)) {
    data.forEach((restaurant, index) => {
      const li = document.createElement("li");
      li.onclick = async () => {
        const restaurantId = restaurant["Restaurant ID"];
        try {
          const restaurantData = await getRestaurantData(restaurantId);
          console.log(restaurantData["Restaurant Name"], restaurantId);
          window.open(
            `https://www.google.com/search?q=${restaurantData["Restaurant Name"]}+${restaurantData.Locality}+${restaurantData["Locality Verbose"]}`,
            "_blank"
          );
        } catch (error) {
          console.error(`Error fetching data for ${restaurantId}:`, error);
          throw error;
        }
      };
      const ratingColor = restaurant["Rating color"]
        .toLowerCase()
        .replace(/\s+/g, "");

      li.innerHTML = `
        <strong>${index + 1}. ${restaurant["Restaurant Name"]}</strong><br>
        <small>Address: ${restaurant.Address}, ${restaurant.Locality}, ${
        restaurant["Locality Verbose"]
      }</small><br>
        Cuisine: ${restaurant.Cuisines}<br>
        Price Range: ${restaurant["Price range"]}<br>
        Rating: ${
          restaurant["Aggregate rating"]
        } (<span style="color:${ratingColor}; font-weight:600;">${
        restaurant["Rating text"]
      }</span>)<br>
        Votes: ${restaurant.Votes}<br>
      `;
      cityDataContainer.appendChild(li);
    });
  } else if (data && data.message) {
    cityDataContainer.textContent = data.message;
  } else {
    cityDataContainer.textContent = "No data available for this city.";
  }
};

displayCities();

const cursor = document.getElementById("cursor");

window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  cursor.animate(
    {
      left: `${posX}px`,
      top: `${posY}px`,
    },
    { duration: 150, fill: "forwards" }
  );
});
