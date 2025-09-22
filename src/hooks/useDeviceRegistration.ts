import { useEffect, useState } from 'react';
import { getDBConnection, createDeviceTable, getRegisteredDevice, updateDeviceRegisteredAt } from '../database/db';
import { validateTokenApi } from '../api/device';

const isExpired = (registeredAt: string): boolean => {
  const registeredDate = new Date(registeredAt);
  const now = new Date();
  const diffInDays = (now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24);
  console.log("now:"+ now)
  console.log("registeredate: "+registeredDate)
  console.log("diff: "+diffInDays);
  return diffInDays > 30;
};

export const useDeviceRegistration = () => {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      const db = await getDBConnection();
      await createDeviceTable(db);
      const device = await getRegisteredDevice(db);

      if (!device) {
        setIsRegistered(false);
        return;
      }

      const { imei, token, registered_at } = device;

      // ✅ Check expiration
      if (isExpired(registered_at)) {
        console.log("⚠️ Registration expired, validating token...");
        const stillValid = await validateTokenApi(imei,token);

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
    };

    init();
  }, []);

  return { isRegistered };
};