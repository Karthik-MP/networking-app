import JobCard from "@components/JobCard";
import { limit, orderBy, where } from "firebase/firestore";
import { useState } from "react";
import CustomFlatList from "../components/CustomFlatList";

export default function JobsListScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  const PAGE = 10;
  const constraints = [
    where("status", "==", "open"),
    orderBy("createdAt", "desc"),
    limit(PAGE),
  ];

  const openDetail = (job) => {
    navigation.navigate("JobDetail", { jobId: job.id });
  };

  return (
    <CustomFlatList
      queryKey={"jobs"}
      Component={JobCard}
      componentOnPressFn={openDetail}
      collection_name={"job_referrals"}
      constraints={constraints}
    />
  );
}
