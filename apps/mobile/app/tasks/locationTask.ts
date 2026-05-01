import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { supabase } from '@bazar/shared/src/supabase';

export const LOCATION_TRACKING_TASK = 'LOCATION_TRACKING_TASK';

TaskManager.defineTask(LOCATION_TRACKING_TASK, async ({ data, error }: any) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const { coords } = locations[0];
    const { latitude, longitude } = coords;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Stream to Supabase
    await supabase.from('runner_location_log').insert({
      runner_id: user.id,
      location: `POINT(${longitude} ${latitude})`
    });

    await supabase.from('runner_profiles').update({
      current_location: `POINT(${longitude} ${latitude})`,
      last_seen: new Date().toISOString()
    }).eq('user_id', user.id);
  }
});

export const startLocationTracking = async () => {
  await Location.startLocationUpdatesAsync(LOCATION_TRACKING_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 10000, // 10 seconds
    distanceInterval: 10,
    foregroundService: {
      notificationTitle: "TENI Runner",
      notificationBody: "You are online and tracking location.",
    },
  });
};

export const stopLocationTracking = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK);
};
