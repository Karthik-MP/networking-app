import Loading from "@components/Loading/Loading";
import { db } from "@services/firebase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { collection, getDocs, query, startAfter } from "firebase/firestore";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";

export default function CustomFlatList({
  name,
  queryKey,
  Component,
  collection_name,
  constraints = [],
}) {
  const fetchData = async ({ pageParam = null }) => {
    try {
      const queryConstraints = [...constraints];
      if (pageParam) {
        queryConstraints.push(startAfter(pageParam));
      }

      console.log("Fetching from:", collection_name, "with constraints:", constraints.length);
      const q = query(collection(db, collection_name), ...queryConstraints);
      const snap = await getDocs(q);

      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      console.log(`Fetched ${items.length} items from ${collection_name}`);

      return {
        items,
        lastDoc: snap.docs[snap.docs.length - 1] || null,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchData,
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    initialPageParam: null,
  });

  const flatData = data?.pages?.flatMap((page) => page.items) ?? [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) return <Loading size="46" />;

  console.log("FlatList data length:", flatData.length, "isLoading:", isLoading);

  return (
    <FlatList
      data={flatData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Component item={item} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        !isLoading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666' }}>No users found</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={{ marginVertical: 12 }} />
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
}
