import JobCard from "@components/JobCard";
import Loading from "@components/Loading/Loading";
import { db } from "@services/firebase";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl
} from "react-native";

export default function JobsListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [last, setLast] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const PAGE = 10;

  const baseQuery = useCallback((cursor) => {
    const constraints = [
      where("status", "==", "open"),
      orderBy("createdAt", "desc"),
      limit(PAGE),
    ];
    console.log("Fetching data");
    if (cursor) constraints.splice(2, 0, startAfter(cursor));
    return query(collection(db, "job_referrals"), ...constraints);
  }, []);

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Starting to fetch jobs...");
      const snap = await getDocs(baseQuery());
      console.log("Snapshot received, docs count:", snap.docs.length);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("Fetched items:", items);
      setJobs(items);
      setLast(snap.docs[snap.docs.length - 1] || null);
    } catch (error) {
      console.error("Error loading jobs:", error);
      console.error("Error details:", error.message);
    } finally {
      setLoading(false);
    }
  }, [baseQuery]);

  const loadMore = useCallback(async () => {
    if (!last || loadingMore) return;
    try {
      setLoadingMore(true);
      console.log("Loading more jobs...");
      const snap = await getDocs(baseQuery(last));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("Loaded more items:", items.length);
      setJobs((prev) => [...prev, ...items]);
      setLast(snap.docs[snap.docs.length - 1] || null);
    } catch (error) {
      console.error("Error loading more jobs:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [baseQuery, last, loadingMore]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const openDetail = (job) => {
    navigation.navigate("JobDetail", { jobId: job.id, job });
  };

  if (loading) return <Loading size="46" />;

  return (
    <FlatList
      data={jobs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <JobCard job={item} onPress={() => openDetail(item)} />
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={{ marginVertical: 12 }} />
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadInitial} />
      }
    />
  );
}
