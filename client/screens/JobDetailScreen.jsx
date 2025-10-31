import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../services/firebase';

function formatSalary(salary) {
  if (!salary || !salary.amount) return '';
  const amt = Number(salary.amount);
  const symbol = salary.currency === 'USD' ? '$' : (salary.currency === 'INR' ? '₹' : `${salary.currency} `);
  const pretty = amt >= 1000 ? `${Math.round(amt / 1000)}k` : amt;
  const per = salary.period || 'year';
  return `${symbol}${pretty}/${per}`;
}

export default function JobDetailScreen({ route }) {
  const { jobId, job: initialJob } = route.params || {};
  const [job, setJob] = useState(initialJob || null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!jobId) return;
      const snap = await getDoc(doc(db, 'job_referrals', jobId));
      if (snap.exists() && active) setJob({ id: snap.id, ...snap.data() });
    };
    if (!initialJob) load();
    return () => { active = false; };
  }, [jobId, initialJob]);

  const salary = useMemo(() => formatSalary(job?.salary), [job]);

  if (!job) return <View className="flex-1 items-center justify-center"><Text>Loading...</Text></View>;

  const openExternal = async () => {
    const url = job.jobLink;
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert('Cannot open link', url);
    } catch (e) {
      Alert.alert('Cannot open link', 'Please try again.');
    }
  };

  const onApply = () => {
    // no-op for now as requested
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} className="bg-white">
      <Text className="text-xl font-semibold" numberOfLines={2}>{job.position}</Text>
      <Text className="text-gray-700 mt-1">{job.company?.name || ''}</Text>

      <View className="flex-row items-center mt-2">
        <Ionicons name="location-outline" size={16} color="#6b7280" />
        <Text className="text-gray-600 ml-1 flex-1" numberOfLines={2}>
          {(job.company?.locations || []).join(' • ') || '—'}
        </Text>
      </View>

      {!!job.workMode && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="briefcase-outline" size={16} color="#6b7280" />
          <Text className="text-gray-700 ml-1">{job.workMode}</Text>
        </View>
      )}

      {!!salary && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="cash-outline" size={16} color="#6b7280" />
          <Text className="text-gray-800 ml-1">{salary}</Text>
        </View>
      )}

      <View className="h-px bg-gray-200 my-4" />

      <Text className="text-base font-semibold mb-2">About the job</Text>
      <Text className="text-gray-800 leading-6" style={{ lineHeight: 20 }}>
        {job.jobDescription || 'No description provided.'}
      </Text>

      <View className="mt-6 flex-row gap-3">
        <Pressable onPress={openExternal} className="px-4 py-3 rounded-xl bg-gray-100">
          <Text>Open Job Link</Text>
        </Pressable>
        <Pressable onPress={onApply} className="px-4 py-3 rounded-xl bg-black">
          <Text className="text-white">Apply</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

