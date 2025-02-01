import { useState, useEffect } from "react";

const ShippingCostCalculator = ({ onCostCalculated, totalWeight }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [costs, setCosts] = useState([]); // Initialize as an empty array
  const [selectedService, setSelectedService] = useState(null); // New state for selected service
  const [error, setError] = useState("");

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/provinces");
        const data = await response.json();
        setProvinces(data.rajaongkir.results);
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Failed to fetch provinces.");
      }
    };

    fetchProvinces();
  }, []);

  // Fetch cities based on selected province
  const fetchCities = async (provinceId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/cities/${provinceId}`
      );
      const data = await response.json();
      setCities(data.rajaongkir.results);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Failed to fetch cities.");
    }
  };

  // Handle province change
  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setCities([]); // Reset cities when province changes
    setSelectedCity(""); // Reset selected city
    if (provinceId) {
      fetchCities(provinceId);
    }
  };

  // Handle city change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // Handle courier change
  const handleCourierChange = (e) => {
    setSelectedCourier(e.target.value);
  };

  // Calculate shipping cost
  // const calculateCost = async () => {
  //   if (!selectedProvince || !selectedCity || !selectedCourier) {
  //     setError("Please select both province, city, and courier.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`http://localhost:5001/api/cost`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         origin: 1, // Ganti dengan ID kota asal
  //         destination: selectedCity,
  //         weight: 1000, // Ganti dengan berat barang dalam gram
  //         courier: selectedCourier, // Ganti dengan kurir yang diinginkan
  //       }),
  //     });
  //     const data = await response.json();

  //     setCosts(data.rajaongkir.results);
  //     onCostCalculated(data.rajaongkir.results); // Kirim biaya ke komponen induk
  //     setError(""); // Clear any previous errors
  //   } catch (err) {
  //     console.error("Error calculating cost:", err);
  //     setError("Failed to calculate shipping cost.");
  //   }
  // };
  // Calculate shipping cost
  const calculateCost = async () => {
    if (!selectedProvince || !selectedCity || !selectedCourier) {
      setError("Please select both province, city, and courier.");
      return;
    }

    // Set shipping cost to 0 if 'ambil_di_toko' is selected
    let shippingCost = selectedCourier === "ambil_di_toko" ? 0 : null;

    if (shippingCost === null) {
      console.log("Total weight:", totalWeight);

      try {
        const response = await fetch(`http://localhost:5001/api/cost`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin: 115, // Replace with the actual origin city ID
            destination: selectedCity,
            weight: totalWeight, // Replace with the actual weight in grams
            courier: selectedCourier,
          }),
        });
        const data = await response.json();
        setCosts(data.rajaongkir.results);
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error("Error calculating cost:", err);
        setError("Failed to calculate shipping cost.");
      }
    } else {
      // If shippingCost is 0, directly call onCostCalculated
      onCostCalculated({ cost: shippingCost });
      setCosts([]); // Clear the costs array
    }
  };

  const handleServiceSelect = (e) => {
    const selectedServiceCode = e.target.value; // Get the selected service code
    const selectedService = costs
      .flatMap((item) => item.costs) // Flatten the costs array to get all services
      .find((service) => service.service === selectedServiceCode); // Find the selected service

    if (selectedService) {
      // console.log("Shipping cost calculated:", selectedService); // Log the selected service details
      setSelectedService(selectedService); // Update the selected service state
      onCostCalculated(selectedService); // Send the selected service to the parent component
    } else {
      console.error("Selected service not found."); // Log an error if the service is not found
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {error && <p className="error text-red-400">{error}</p>}
      {/* Province */}
      <select
        id="province"
        value={selectedProvince}
        onChange={handleProvinceChange}
      >
        <option value="">Select Province</option>
        {provinces.map((province) => (
          <option key={province.province_id} value={province.province_id}>
            {province.province}
          </option>
        ))}
      </select>

      {/* City */}
      <select
        id="city"
        value={selectedCity}
        onChange={handleCityChange}
        disabled={!cities.length}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.city_id} value={city.city_id}>
            {city.city_name}
          </option>
        ))}
      </select>

      {/* Courier */}
      <select
        id="courier"
        value={selectedCourier}
        onChange={handleCourierChange}
        required
      >
        <option value="">Select Courier</option>
        <option value="jne">JNE</option>
        <option value="pos">POS</option>
        <option value="tiki">TIKI</option>
        <option value="ambil_di_toko">Ambil di Toko</option>
      </select>

      <button
        type="button" // Ubah menjadi type="button"
        className="bg-blue-500 text-white p-2"
        onClick={calculateCost} // Panggil fungsi calculateCost saat tombol ditekan
      >
        Hitung Biaya Pengiriman
      </button>

      {/* {costs &&
        costs.length > 0 && ( // Check if costs is not null and has length
          <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Biaya Pengiriman:
            </h3>
            {costs.flatMap((item) =>
              item.costs.map((service) => (
                <div key={service.service} className="flex items-center">
                  <input
                    type="radio"
                    id={service.service}
                    name="shippingService" // Grouping name for radio buttons
                    value={service.service} // Value to identify the service
                    checked={selectedService?.service === service.service} // Check if this service is selected
                    onChange={handleServiceSelect} // Handle selection change
                    className="mr-2"
                  />
                  <label htmlFor={service.service}>
                    {service.description} - Rp{" "}
                    {service.cost[0].value.toLocaleString()} - Estimasi:{" "}
                    {service.cost[0].etd} hari
                  </label>
                </div>
              ))
            )}
          </div>
        )}
         */}

      {costs &&
        costs.length > 0 && ( // Check if costs is not null and has length
          <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Biaya Pengiriman:
            </h3>
            {costs.flatMap((item) =>
              item.costs.map((service) => (
                <div key={service.service} className="flex items-center">
                  <input
                    type="radio"
                    id={service.service}
                    name="shippingService" // Grouping name for radio buttons
                    value={service.service} // Value to identify the service
                    checked={selectedService?.service === service.service} // Check if this service is selected
                    onChange={handleServiceSelect} // Handle selection change
                    className="mr-2"
                  />
                  <label htmlFor={service.service}>
                    {service.description} - Rp{" "}
                    {service.cost[0].value.toLocaleString()} - Estimasi:{" "}
                    {service.cost[0].etd} hari
                  </label>
                </div>
              ))
            )}
            {selectedService && selectedService.cost[0].value === 0 && (
              <p className="text-green-500">Biaya Pengiriman = 0</p>
            )}
          </div>
        )}
    </div>
  );
};

export default ShippingCostCalculator;
