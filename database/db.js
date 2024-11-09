import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

// Define a custom path for the database
// const getDatabasePath = async () => {
//   const documentDirectory = FileSystem.documentDirectory; // Get the default document directory
//   const dbPath = documentDirectory + 'equipmentDB.db'; // Specify the path and database name
//   return dbPath;
// };

// // Open or create the database at the custom path
// export const openDatabase = async () => {
//   const dbPath = await getDatabasePath();
//   const db = SQLite.openDatabaseSync(dbPath);
//   console.log(db)
//   return db;
// };

// Function to insert data into the table


// Function to retrieve all data from the table
export const getAllData = async (callback) => {
  const db = await SQLite.openDatabaseAsync('inventory');
  const allRows = await db.getAllAsync('SELECT * FROM equipment');
  console.log(allRows)
  for (const row of allRows) {
    console.log(row.id, row.value, row.intValue);
  }};
