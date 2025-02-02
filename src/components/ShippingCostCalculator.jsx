import { useState, useEffect } from "react";

const ShippingCostCalculator = ({ onCostCalculated, totalWeight }) => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [costs, setCosts] = useState([]);
  const [address, setAddresses] = useState("");
  const [selectedService, setSelectedService] = useState(null);
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
    setCities([]);
    setSelectedCity("");
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

  // Handle address input change
  const handleAddressChange = (event) => {
    setAddresses(event.target.value);
  };

  // Calculate shipping cost
  const calculateCost = async () => {
    if (!selectedProvince || !selectedCity || !selectedCourier) {
      setError("Please select both province, city, and courier.");
      return;
    }

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
            origin: 115,
            destination: selectedCity,
            weight: totalWeight,
            courier: selectedCourier,
          }),
        });
        const data = await response.json();
        setCosts(data.rajaongkir.results);
        setError("");
      } catch (err) {
        console.error("Error calculating cost:", err);
        setError("Failed to calculate shipping cost.");
      }
    } else {
      onCostCalculated({ cost: shippingCost });
      setCosts([]);
    }
  };

  const handleServiceSelect = (e) => {
    const selectedServiceCode = e.target.value;
    const selectedService = costs
      .flatMap((item) => item.costs)
      .find((service) => service.service === selectedServiceCode);

    // Ensure that selectedCity and selectedProvince are valid before accessing their properties
    const selectedCityName =
      cities.find((city) => city.city_id === selectedCity)?.city_name || "";
    const selectedProvinceName =
      provinces.find((province) => province.province_id === selectedProvince)
        ?.province || "";

    // Construct the address string
    const address2 = `${address}, ${selectedCityName}, ${selectedProvinceName}`;

    // Call the onCostCalculated function with the selected service and address
    onCostCalculated({
      service: selectedService,
      address: address2,
      courier: selectedCourier,
    });
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

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Address"
        className="border p-2"
        value={address}
        onChange={handleAddressChange}
        required
      />

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
        type="button"
        className="bg-blue-500 text-white p-2"
        onClick={calculateCost}
      >
        Hitung Biaya Pengiriman
      </button>

      {costs && costs.length > 0 && (
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
                  name="shippingService"
                  value={service.service}
                  checked={selectedService?.service === service.service}
                  onChange={handleServiceSelect}
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
