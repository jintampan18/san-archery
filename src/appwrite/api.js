import { ID, ImageGravity, Query } from "appwrite";
import { account, appwriteConfig, databases, storage } from "./config.js";

export async function getAllPackage() {
    try {
        const packages = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.packageId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        );

        if (!packages) throw Error;

        return packages;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProducts(searchTerm = '') {
    try {
        const queries = [
            Query.equal('status', 'active'), 
            Query.orderAsc('$createdAt'),
        ];

        if (searchTerm) {
            queries.push(Query.search('name', searchTerm)); // Menambahkan kondisi pencarian
        }

        const products = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            queries
        );

        if (!products) throw new Error('Failed to fetch products');

        return products;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllComments() {
    try {
        const comments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.comentId,
            [Query.orderAsc('$createdAt'), Query.limit(20)]
        );

        if (!comments) throw Error;

        return comments;
    } catch (error) {
        console.log(error);
    }
}

export async function createComment(comment) {
    try {
        const newComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.comentId,
            ID.unique(),
            {
                name: comment.name,
                caption: comment.caption
            }
        );
        console.log("halo", newComment);

        if (!newComment) throw Error;

        return newComment;
    } catch (error) {
        console.log(error);
    }
}

// export async function getAllCustomer() {
//     try {
//         const customers = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.customerCollectionId,
//             [Query.orderAsc('$createdAt')]
//         );
//         if (!customers) throw Error;

//         return customers;
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function getAllCustomer() {
    try {
        const customers = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.customerCollectionId,
            [
                Query.orderAsc('$createdAt') // Order by createdAt
            ]
        );

        console.log('Fetched customers:', customers); // Log fetched customers
        

        if (!customers) throw new Error("No customers found");

        return customers;
    } catch (error) {
        console.log(error);
        return []; // Return an empty array or handle the error as needed
    }
}


export async function getOrderByCustomerId(customerId) {
    try {
        console.log('Fetching order with customer ID:', customerId); // Tambahkan log ID
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.orderCollectionId,
            [Query.equal('customer', customerId)]
        );
        // console.log('Fetched orders:', response.documents); // Tambahkan log data order
        return response.documents;
    } catch (error) {
        console.error('Error fetching order by customer ID:', error);
        throw error;
    }
}

export async function getAllProductsAdmin() {
    try {
        const products = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        );
        return products;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100
        );
        return fileUrl
    } catch (error) {
        console.log(error);

    }
}

export async function deleteFile(fileId) {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
}

export async function createProduct(product) {
    try {
        const uploadedFile = await uploadFile(product.file[0]);

        if (!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            deleteFile(uploadedFile.$id)
            throw Error
        }
        
        const newProduct = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            ID.unique(),
            {
                name: product.name,
                description: product.description,
                price: product.price,
                discountPrice: product.discountPrice, // Tambahkan harga diskon
                stock: product.stock,
                weight: product.weight, // Menyimpan weight ke database
                imageUrl: fileUrl,
                status: 'active' // Tambahkan status produk
            }
        );

        if (!newProduct) {
            await deleteFile(uploadedFile.$id)
            throw Error
        };

        return newProduct;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}


export async function updateProduct(product) {
    const hasFileToUpdate = product.file.length > 0;
    try {
        let image = {
            imageUrl: product.imageUrl
        };
        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(product.file[0]);
            const fileUrl = getFilePreview(uploadedFile.$id);

            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw new Error("Failed to get file URL");
            }
            image = { ...image, imageUrl: fileUrl };
        }
        const updatedProduct = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            product.productId,
            {
                name: product.name,
                description: product.description,
                price: product.price,
                discountPrice: product.discountPrice, // Pastikan harga diskon disertakan
                stock: product.stock,
                weight: product.weight,
                imageUrl: product.imageUrl // Misalnya, jika Anda menyimpan URL gambar
            }
        );
        return updatedProduct;
    } catch (error) {
        console.log(error);
        throw error; // Tambahkan throw error untuk menangani error di tempat lain
    }
}

export async function updateCustomer(customer) {
    console.log(customer)
    await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.customerCollectionId, customer.$id, {hasPaid: customer.hasPaid});
}

export async function getProductById(productId) {
    try {
        const product = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            productId
        );
        return product;
    } catch (error) {
        console.log(error);

    }
}

export async function deleteProduct(productId) {
    await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.productId, productId);
}

export async function findUser(email) {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('email', email)]
        )
        return response
    } catch (error) {
        console.log(error);
    }
}

export async function updateOrder(orderId, status) {
    await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.orderCollectionId, orderId, {
        status: status
    });
}

export async function updateProductStock(productId, newStock) {
    try {
        // Dapatkan stok terbaru dari database
        const product = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            productId
        );

        if (product.stock <= 0) {
            throw new Error("Stok tidak mencukupi"); // Validasi stok di backend
        }

        // Update stok jika validasi berhasil
        const updatedProduct = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.productId,
            productId,
            { stock: newStock }
        );

        return updatedProduct;
    } catch (error) {
        console.error("Error updating stock:", error);
        throw error; // Lempar error untuk ditangani di frontend
    }
}
