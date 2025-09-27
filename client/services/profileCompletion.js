// client/services/profileCompletion.js
export function computeProfileCompletion(profile) {
  if (!profile) return 0;

  // base score (exclude avatar)
  let score = 0;
  let total = 10;

  if ((profile?.education || []).length) score = score + 3;
  if ((profile?.photoURL || "")) score = score + 2;
  if ((profile?.experience || []).length) score = score + 3;
  if ((profile?.interests?.industries?.length || 0) + (profile?.interests?.it_sub?.length || 0)) score = score + 2;

  const base = Math.round((score / total) * 100);

  return base;                    // 100% requires photo + full base
}
