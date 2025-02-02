import express from 'express';
import midtransClient from 'midtrans-client';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client, Databases, ID } from 'appwrite';
import axios from 'axios';
import { log } from 'console';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());

// ✅ Inisialisasi Appwrite Client
const client = new Client();
client
    .setEndpoint(process.env.VITE_ENDPOINT)
    .setProject(process.env.VITE_PROJECT_ID);

const databases = new Databases(client);
console.log("✅ Appwrite Client Initialized");

app.get('/payment-status/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic U0ItTWlkLXNlcnZlci1wVG55VmRzclBVQmxuRzdtODlNUlFIamQ6', // Your actual server key
            },
        });

        res.json(response.data); // Send the Midtrans response back to the frontend
    } catch (error) {
        // Log full error details
        console.error('Error fetching payment status:', error.response || error.message);
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
});

// ================================
// Endpoint untuk membuat transaksi Midtrans
// ================================
app.post('/create-transaction', async (req, res) => {
    try {
        const { customerData, cartItems, shippingCost, shippingOption, totalAmount, address } = req.body;

        console.log("📦 Received customerData:", customerData);
        console.log("🛍️ Received cartItems:", cartItems);
        console.log("🚚 Shipping Cost:", shippingCost);
        console.log("💵 Total Amount:", totalAmount);
        console.log("🏠 Address:", address);
        console.log("🚚 Shipping Option:", shippingOption);
        
        if (!customerData || !cartItems || cartItems.length === 0) {
            console.error("Missing customerData or cartItems");
            return res.status(400).json({ error: "Invalid request data" });
        }

        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.VITE_MIDTRANS_SERVER_KEY, 
            clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY
        });

        let order_id = `order-${Date.now()}`;

        let itemDetails = cartItems.map(item => ({
            id: item.product,
            price: item.price,
            quantity: item.quantity,
            name: item.product
        }));

        // Tambahkan shipping sebagai item terpisah
        itemDetails.push({
            id: 'shipping',
            price: shippingCost,
            quantity: 1,
            name: `Shipping (${shippingOption})`
        });

        let parameter = {
            transaction_details: {
                order_id: `order-${Date.now()}`,
                gross_amount: totalAmount 
            },
            customer_details: {
                first_name: customerData.name,
                email: customerData.email,
                phone: customerData.phoneNumber,
                address: address,
            },
            item_details: itemDetails
        };

        console.log("📜 Final Order Data:", JSON.stringify(parameter, null, 2));

        const transaction = await snap.createTransaction(parameter);
        console.log("✅ Transaction created successfully:", transaction);

        // ✅ Panggil `saveOrder()` sebelum mengirim respons
        await saveOrder(customerData, cartItems, totalAmount, address, shippingCost, shippingOption, order_id);

        // ✅ Kirim respons setelah data tersimpan
        res.json({ token: transaction.token, param: parameter });

    } catch (error) {
        console.error("Midtrans Transaction Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});

// ================================
// Webhook Midtrans untuk menangani notifikasi pembayaran
// ================================
app.post('/midtrans-notification', async (req, res) => {
    try {
        const notification = req.body;
        console.log("Midtrans Notification Received:", notification);

        if (notification.transaction_status === "settlement") {
            await databases.updateDocument(
                process.env.VITE_DATABASE_ID,
                process.env.VITE_COLLECTION_ID_CUSTOMER,
                notification.order_id,
                { hasPaid: true }
            );
            console.log("Payment status updated to paid");
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).send("Error updating payment status");
    }
});

// ================================
// Fungsi untuk menyimpan data ke Appwrite
// ================================
async function saveOrder(customerData, cartItems, totalAmount, address, shippingCost, shippingOption, transaction_id) {
    try {
        console.log('Saving order with customerData:', customerData);
        console.log('Saving order with cartItems:', cartItems);
        console.log('Saving order with totalAmount', totalAmount);
        

        // Simpan data customer ke Appwrite
        const customer = await databases.createDocument(
            process.env.VITE_DATABASE_ID,
            process.env.VITE_COLLECTION_ID_CUSTOMER,
            ID.unique(),
            {
                name: customerData.name,
                email: customerData.email,
                phoneNumber: customerData.phoneNumber,
                address: address,
                shippingOption: shippingOption,
                transaction_id: transaction_id,
                hasPaid: false,
                shippingCost: shippingCost,
                totalAmount: totalAmount,
                tanggalTransaksi: new Date().toISOString()
            },
            { 
                'X-Appwrite-Key': process.env.VITE_SECRET_KEY  // ✅ API Key digunakan di headers
            }
        );

        console.log("Customer saved successfully:", customer);

        // Simpan data pesanan ke Appwrite
        for (const item of cartItems) {
            try {
                const order = await databases.createDocument(
                    process.env.VITE_DATABASE_ID,
                    process.env.VITE_COLLECTION_ID_ORDER,
                    ID.unique(),
                    {
                        customer: customer.$id,
                        product: item.product,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice
                    },
                    { 
                        'X-Appwrite-Key': process.env.VITE_SECRET_KEY  // ✅ API Key digunakan di headers
                    }
                );
                console.log("Order saved successfully:", order);
            } catch (orderError) {
                console.error('Error saving order item:', orderError.message);
            }
        }
        
        // ✅ Update stok produk berdasarkan cartItems  
        // await updateStock(cartItems);  
        // console.log('Stock updated successfully');
        
        console.log('Ordersss process completed successfully');

    } catch (error) {
        console.error('Error saving order:', error.response || error.message);
    }
}

// ================================
// Fungsi untuk memperbarui stok produk di Appwrite
// ================================
async function updateStock(cartItems) {  
    for (const item of cartItems) {  
        console.log("📦 Cart Item:", item);
        
        const productName = item.product; // Nama produk  
        const quantityToReduce = item.quantity; // Kuantitas yang akan dikurangi    
  
        try { 
            // Mencetak nama produk  
            console.log("🔍 Product Name:", productName);  
  
            // Mengambil dokumen produk berdasarkan
            const products = await databases.listDocuments(  
                process.env.VITE_DATABASE_ID,  
                process.env.VITE_COLLECTION_ID_PRODUCT, 
            );  

           // Mencari produk berdasarkan nama  
           const product = products.documents.find((doc) => doc.name === productName);  
  
           // Pastikan produk ditemukan  
           if (!product) {  
               console.error(`Product not found: ${productName}`);  
               continue; // Lewati jika produk tidak ditemukan  
           }  
 
           const productId = product.$id; // Ambil ID produk
           console.log("🆔 Product ID:", productId);
           console.log("📦 Jumlah Stock yang akan dikurangi:", quantityToReduce); 
           console.log("📦 Current Stock:", product.stock);  
 
           // Pastikan stok cukup sebelum mengurangi  
           if (product.stock < quantityToReduce) {  
               console.error(`Not enough stock for product ${productName}. Current stock: ${product.stock}`);  
               continue; // Lewati jika stok tidak cukup  
           }  
 
           // Mengupdate stok di database  
           const updatedProduct = await databases.updateDocument(  
               process.env.VITE_DATABASE_ID,  
               process.env.VITE_COLLECTION_ID_PRODUCT, // Ganti dengan ID koleksi produk Anda  
               productId, // ID produk yang valid  
               {  
                   stock: product.stock - quantityToReduce // Kurangi stok  
               },  
               {   
                   'X-Appwrite-Key': process.env.VITE_SECRET_KEY  // ✅ API Key digunakan di headers  
               }  
           );  

            console.log(`Stock updated successfully for product ${productId}:`, updatedProduct);  
        } catch (stockError) {  
            console.error(`Errorss updating stock for product ${productName}:`, stockError.message);  
            throw stockError; // Lempar kesalahan jika pembaruan stok gagal  
        }  
    }  
} 


// ================================
// Server khusus Rajanya Ongkir
// ================================
// Proxy endpoint untuk fetch provinces  
app.get("/api/provinces", async (req, res) => {  
  console.log("Received request to fetch provinces");  
  try {  
    const response = await axios.get(  
      "https://api.rajaongkir.com/starter/province",  
      {  
        headers: {  
          key: process.env.VITE_RAJA_ONGKIR_API_KEY, // Ganti dengan API Key Raja Ongkir  
        },  
      }  
    );  
    console.log("Provinces fetched successfully:", response.data);  
    res.json(response.data);  
  } catch (error) {  
    console.error("Error fetching provinces:", error.message);  
    res.status(500).send("Server Error");  
  }  
});  
  
// Proxy endpoint untuk fetch cities  
app.get("/api/cities/:provinceId", async (req, res) => {  
  const { provinceId } = req.params;  
  console.log(`Received request to fetch cities for province ID: ${provinceId}`);  
  try {  
    const response = await axios.get(  
      `https://api.rajaongkir.com/starter/city?province=${provinceId}`,  
      {  
        headers: {  
          key: process.env.VITE_RAJA_ONGKIR_API_KEY, // Ganti dengan API Key Raja Ongkir  
        },  
      }  
    );  
    console.log("Cities fetched successfully:", response.data);  
    res.json(response.data);  
  } catch (error) {  
    console.error("Error fetching cities:", error.message);  
    res.status(500).send("Server Error");  
  }  
});  
  
// Proxy endpoint untuk calculate shipping cost  
app.post("/api/cost", async (req, res) => {  
  const { origin, destination, weight, courier } = req.body; 
   
  console.log(`Received request to calculate cost: origin=${origin}, destination=${destination}, weight=${weight}, courier=${courier}`);  
  try {  
    const response = await axios.post(  
      "https://api.rajaongkir.com/starter/cost",  
      {  
        origin,  
        destination,  
        weight,  
        courier,  
      },  
      {  
        headers: {  
          key: process.env.VITE_RAJA_ONGKIR_API_KEY, // Ganti dengan API Key Raja Ongkir  
        },  
      }  
    );  
    console.log("Shipping cost calculated successfully:", response.data);  
    res.json(response.data);  
  } catch (error) {  
    console.error("Error calculating shipping cost:", error.message);  
    res.status(500).send("Server Error");  
  }  
});  


// ================================
// Jalankan server
// ================================
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});