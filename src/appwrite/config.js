import { Account, Client, Databases, Storage } from 'appwrite';

export const appwriteConfig = {
    endpoint: import.meta.env.VITE_ENDPOINT,
    projectId: import.meta.env.VITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_DATABASE_ID,
    customerCollectionId: import.meta.env.VITE_COLLECTION_ID_CUSTOMER,
    orderCollectionId: import.meta.env.VITE_COLLECTION_ID_ORDER,
    packageId: import.meta.env.VITE_COLLECTION_ID_PACKAGE,
    storageId: import.meta.env.VITE_STORAGE_ID,
    productId: import.meta.env.VITE_COLLECTION_ID_PRODUCT,
    comentId: import.meta.env.VITE_COLLECTION_ID_COMMENT,
    userCollectionId: import.meta.env.VITE_COLLECTION_ID_USER,
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);


export const databases = new Databases(client)
export const account = new Account(client)
export const storage = new Storage(client)
export { ID } from 'appwrite';