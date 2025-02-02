const dateFormater = (dateString) => {
    if (!dateString) return "Tidak Tersedia"; // Return "Tidak Tersedia" if date is null

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = date.toLocaleString('id-ID', options); // Format date in Indonesian locale

    return formattedDate.replace(',', ''); // Remove the comma for better formatting
};

export default dateFormater;