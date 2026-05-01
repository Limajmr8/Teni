import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '@bazar/shared/src/supabase';
import { SubOrder } from '@bazar/shared/src/index';
import { MapPin, Navigation, Package, DollarSign, Zap, Clock, List } from 'lucide-react-native';
import { startLocationTracking, stopLocationTracking } from '../tasks/locationTask';
import { LinearGradient } from 'expo-linear-gradient';

export default function RunnerDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeBatches, setActiveBatches] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(450);

  const toggleOnline = async (value: boolean) => {
    setIsOnline(value);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('runner_profiles').update({ is_online: value }).eq('user_id', user.id);

    if (value) {
      await startLocationTracking();
      // Fetch available or assigned batches
      const { data } = await supabase
        .from('delivery_batches')
        .select('*')
        .in('status', ['ready', 'accumulating'])
        .order('created_at', { ascending: false });
        
      if (data) setActiveBatches(data);
    } else {
      await stopLocationTracking();
      setActiveBatches([]); // clear batches when offline
    }
  };

  useEffect(() => {
    if (isOnline) {
      toggleOnline(true);
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#10b981', '#059669']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>RUNNER PANEL</Text>
            <Text style={styles.subtitle}>Mokokchung Sector A</Text>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
            <Switch 
              value={isOnline} 
              onValueChange={toggleOnline} 
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#ffffff' }}
              thumbColor={isOnline ? '#10b981' : '#f4f3f4'}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={styles.iconContainer}>
            <DollarSign color="#10b981" size={24} />
          </View>
          <Text style={styles.statLabel}>TODAY'S EARNINGS</Text>
          <Text style={styles.statValue}>₹450</Text>
        </View>
        <View style={styles.statBox}>
          <View style={[styles.iconContainer, { backgroundColor: '#eff6ff' }]}>
            <Navigation color="#3b82f6" size={24} />
          </View>
          <Text style={styles.statLabel}>COMPLETED TRIPS</Text>
          <Text style={styles.statValue}>12</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>SCHEDULED BATCHES</Text>
           {isOnline && <View style={styles.pulseIndicator} />}
        </View>
        
        {activeBatches.length === 0 ? (
          <View style={styles.emptyCard}>
            <Package color={isOnline ? "#10b981" : "#d1d5db"} size={48} />
            <Text style={styles.emptyText}>{isOnline ? "Waiting for next batch..." : "Go online to receive batches"}</Text>
          </View>
        ) : (
          activeBatches.map(batch => (
            <View key={batch.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{batch.zone_name}</Text>
                  <Text style={styles.batchSubtext}>Batch #{batch.id.slice(2, 6)} • {batch.order_count} stops</Text>
                </View>
                <View style={styles.statusBadge}>
                   <Text style={styles.orderStatus}>{batch.delivery_window.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.routeContainer}>
                {batch.optimized_route.map((stop: string, index: number) => (
                  <View key={index} style={styles.routeStop}>
                    <View style={styles.routeIconWrapper}>
                      {index === 0 ? <MapPin size={14} color="#10b981" /> : <View style={styles.routeDot} />}
                      {index < batch.optimized_route.length - 1 && <View style={styles.routeLine} />}
                    </View>
                    <Text style={styles.stopText}>{stop}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.batchMeta}>
                <View style={styles.metaItem}>
                  <Clock size={14} color="#6b7280" />
                  <Text style={styles.metaText}>~{batch.estimated_duration_min} mins</Text>
                </View>
                <View style={styles.metaItem}>
                  <List size={14} color="#6b7280" />
                  <Text style={styles.metaText}>Optimized Route</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.button}>
                <LinearGradient colors={['#10b981', '#059669']} style={styles.buttonGradient}>
                   <Text style={styles.buttonText}>START BATCH DELIVERY</Text>
                   <Navigation size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  headerGradient: { borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingBottom: 20 },
  headerContent: { padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },
  switchContainer: { alignItems: 'center', gap: 4 },
  switchLabel: { fontSize: 10, color: '#fff', fontWeight: '900', letterSpacing: 1 },
  statsContainer: { flexDirection: 'row', padding: 16, gap: 16, marginTop: -30 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15, elevation: 5 },
  iconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statLabel: { fontSize: 10, fontWeight: '900', color: '#9ca3af', marginBottom: 4, letterSpacing: 0.5 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#111827' },
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: '#6b7280', letterSpacing: 1 },
  pulseIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  emptyCard: { padding: 60, alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: '#e5e7eb' },
  emptyText: { marginTop: 16, color: '#6b7280', fontWeight: '800', fontSize: 16 },
  orderCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15, elevation: 4, marginBottom: 16 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'flex-start' },
  orderId: { fontWeight: '900', color: '#111827', fontSize: 16 },
  batchSubtext: { fontWeight: '700', color: '#6b7280', fontSize: 12, marginTop: 4 },
  statusBadge: { backgroundColor: '#ecfdf5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  orderStatus: { fontWeight: '900', color: '#10b981', fontSize: 10, letterSpacing: 0.5 },
  routeContainer: { marginBottom: 20, paddingLeft: 4 },
  routeStop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  routeIconWrapper: { width: 16, alignItems: 'center', marginRight: 12, zIndex: 2 },
  routeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d1d5db' },
  routeLine: { position: 'absolute', top: 16, width: 2, height: 24, backgroundColor: '#e5e7eb', zIndex: 1 },
  stopText: { color: '#4b5563', fontSize: 14, fontWeight: '700' },
  batchMeta: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6', marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#6b7280', fontSize: 12, fontWeight: '700' },
  button: { borderRadius: 16, overflow: 'hidden' },
  buttonGradient: { flexDirection: 'row', padding: 16, alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 }
});
