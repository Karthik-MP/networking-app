import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import EventCard from "../components/EventCard";
import SkeletonCard from "../components/SkeletonCard";
import { db } from "../services/firebase";

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [last, setLast] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const PAGE = 8;

  const loadInitial = async () => {
    setLoading(true);
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"), limit(PAGE));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setEvents(items);
    setLast(snap.docs[snap.docs.length - 1] || null);
    setLoading(false);
  };

  // console.log(events)
  const loadMore = async () => {
    if (!last || loadingMore) return;
    setLoadingMore(true);
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"), startAfter(last), limit(PAGE));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setEvents((prev) => [...prev, ...items]);
    setLast(snap.docs[snap.docs.length - 1] || null);
    setLoadingMore(false);
  };

  useEffect(() => { loadInitial(); }, []);

  if (loading) {
    return (
      <View className="p-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EventCard event={item} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null
      }
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadInitial} />
      }
    />
  );
}
