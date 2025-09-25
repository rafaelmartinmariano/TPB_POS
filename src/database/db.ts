import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'pos_system.db';

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  return SQLite.openDatabase({ name: DB_NAME, location: 'default' });
};

export const createDeviceTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imei TEXT NOT NULL,
      token TEXT NOT NULL,
      registered_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.executeSql(query);
};

export const createDateSyncTable = async (db: any) => {
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS last_date_sync_check (
      id INTEGER PRIMARY KEY NOT NULL,
      next_check_date TEXT
    );
  `);
};





export const getRegisteredDevice = async (db: SQLiteDatabase) => {
  const results = await db.executeSql(`SELECT * FROM devices LIMIT 1;`);
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0);
  }
  return null;
};

export const registerDevice = async (db: SQLiteDatabase, imei: string, token: string) => {
  await db.executeSql(`DELETE FROM devices;`); // keep only one registered device
  await db.executeSql(`INSERT INTO devices (imei, token) VALUES (?, ?);`, [imei, token]);
};

export const getAllDevices = async (db: SQLiteDatabase) => {
  const results = await db.executeSql(`SELECT * FROM devices;`);
  let devices: any[] = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      devices.push(result.rows.item(i));
    }
  });
  return devices;
};

export const initDatabase = async () => {
  const db = await getDBConnection();

  // Ensure devices table exists
  await createDeviceTable(db);

  // Force DB file creation by inserting a dummy row if table is empty
  const results = await db.executeSql(`SELECT COUNT(*) as count FROM devices;`);
  const count = results[0].rows.item(0).count;

  if (count === 0) {
    await db.executeSql(
      'INSERT INTO devices (imei, token) VALUES (?, ?);',
      ['init_imei', 'init_token']
    );
  }

  return db;
};

export const closeDBConnection = async (db: SQLiteDatabase) => {
  if (db) {
    try {
      await db.close();
      console.log("✅ Database closed.");
    } catch (error) {
      console.error("❌ Error closing database:", error);
    }
  }
};

export const updateDeviceRegisteredAt = async (db: SQLiteDatabase, imei: string) => {
  const query = `UPDATE devices SET registered_at = CURRENT_TIMESTAMP WHERE imei = ?;`;
  await db.executeSql(query, [imei]);
};