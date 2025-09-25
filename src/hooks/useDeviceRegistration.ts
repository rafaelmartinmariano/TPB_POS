import { useEffect, useState } from 'react';
import { getDBConnection, createDeviceTable, createDateSyncTable, getRegisteredDevice, updateDeviceRegisteredAt, closeDBConnection } from '../database/db';
import { validateTokenApi } from '../api/device';
import axios from "axios";

const isExpired = (registeredAt: string): boolean => {
  const registeredDate = new Date(registeredAt);
  const now = new Date();
  const diffInDays = (now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24);
  console.log("now:" + now)
  console.log("registeredate: " + registeredDate)
  console.log("diff: " + diffInDays);
  return diffInDays > 30;
};

export const checkDateSync = async (): Promise<boolean> => {
  const db = await getDBConnection();

  createDateSyncTable(db);

  //nextDateChecking
  let nextCheck = await getNextDateSyncCheck(db);
  //current date
  const now = new Date();

  //set date if run at the first time
  if (nextCheck !== null) {
    await setNextDateSyncCheck(db);
  }

  //compare current date and to nextCheck
  const dateDiff = (now.getTime() - nextCheck!.getTime()) / (1000 * 60 * 60 * 24);

  //if the last check is greater than 15 days then it's the time to check if the date is sync
  if (dateDiff > 5) {
    try {
      const { data } = await axios.get("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Manila");
      // API returns fields like: year, month, day, hour, minute, seconds
      const { year, month, day } = data;
      const internetDate = new Date(year, month - 1, day);

      const deviceTime = new Date();
      const deviceDateOnly = new Date(
        deviceTime.getFullYear(),
        deviceTime.getMonth(),
        deviceTime.getDate()
      );

      //console.log("🌐 Internet Date:", internetDate.toDateString());
      //console.log("📱 Device Date:", deviceDateOnly.toDateString());

      if (deviceDateOnly.getTime() === internetDate.getTime()) {
        await setNextDateSyncCheck(db);
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.error("⚠️ Failed to fetch internet time", error);
      return false;
    }
  } else {
    //means don't check
    //console.log("not checking");
    return true
  }
}

export const useDeviceRegistration = () => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  checkDateSync();

  useEffect(() => {
    const init = async () => {
      const db = await getDBConnection();

      try {
        await createDeviceTable(db);
        const device = await getRegisteredDevice(db);

        if (!device) {
          setIsRegistered(false);
          return;
        }

        const { imei, token, registered_at } = device;

        // ✅ Check expiration
        console.log("Await in isExpired");
        if (isExpired(registered_at)) {
          console.log("⚠️ Registration expired, validating token...");
          const stillValid = await validateTokenApi(imei, token);

          if (stillValid) {
            await updateDeviceRegisteredAt(db, imei);
            console.log("✅ Token still valid, registration renewed");
            setIsRegistered(true);
          } else {
            console.log("❌ Token invalid, needs re-registration");
            setIsRegistered(false);
          }
        } else {
          setIsRegistered(true);
        }

      } finally {
        await closeDBConnection(db);
      }
    };

    init();
  }, []);

  return { isRegistered };
};


const setNextDateSyncCheck = async (db: any) => {
  const today = new Date();
  //const nextCheck = new Date(today);
  //nextCheck.setDate(today.getDate() + 15);

  await db.executeSql(
    `INSERT OR REPLACE INTO last_date_sync_check (id, next_check_date) VALUES (1, ?)`,
    [today.toISOString()]
  );
};

const getNextDateSyncCheck = async (db: any): Promise<Date | null> => {
  const results = await db.executeSql(`SELECT next_check_date FROM last_date_sync_check WHERE id = 1`);
  if (results[0].rows.length > 0) {
    return new Date(results[0].rows.item(0).next_check_date);
  }
  return new Date();
};



//Helpers
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
};