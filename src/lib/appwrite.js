import { Client, Account, Databases, ID, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Database and collection configuration
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Link functions
export const createLink = async (title, url, userId) => {
  return await databases.createDocument(
    DB_ID,
    COLLECTION_ID,
    ID.unique(),
    {
      title,
      url,
      user_id: userId,
      created_at: new Date().toISOString(),
    }
  );
};

export const getLinks = async (userId) => {
  return await databases.listDocuments(
    DB_ID,
    COLLECTION_ID,
    [Query.equal('user_id', userId), Query.orderDesc('created_at')]
  );
};

export const updateLink = async (id, title, url) => {
  return await databases.updateDocument(
    DB_ID,
    COLLECTION_ID,
    id,
    {
      title,
      url,
    }
  );
};

export const deleteLink = async (id) => {
  return await databases.deleteDocument(
    DB_ID,
    COLLECTION_ID,
    id
  );
};

export { ID };
