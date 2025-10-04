// services/jobReferralService.js
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * @param {{
 *  jobTitle: string,
 *  company: { name: string, locations: string[], industry: string },
 *  position: string,
 *  workMode: 'remote'|'hybrid'|'onsite',
 *  salary: { amount: number, currency: 'USD'|'INR'|'OTHER', period: 'year'|'month'|'hour' },
 *  jobDescription: string,
 *  referralApplicantsLimit: number,
 *  jobLink: string,
 *  referralDeadline: Date | string | number,
 *  jobDeadline: Date | string | number,
 * }} payload
 * @param { { uid?: string, displayName?: string|null, email?: string|null } | null } user
 */
export async function createJobReferral(payload, user) {
  const referralTs = toTimestamp(payload.referralDeadline);
  const jobTs = toTimestamp(payload.jobDeadline);

  const docData = {
    // jobTitle removed
    company: {
      name: payload.company.name,
      locations: payload.company.locations,
      industry: payload.company.industry,
    },
    position: payload.position,
    workMode: payload.workMode,
    salary: {
      amount: Number(payload.salary.amount),
      currency: payload.salary.currency,
      period: payload.salary.period,
    },
    jobDescription: payload.jobDescription,
    referralApplicantsLimit: Number(payload.referralApplicantsLimit),
    jobLink: payload.jobLink,
    referralDeadline: referralTs,
    jobDeadline: jobTs,

    createdBy: {
      uid: user?.uid ?? null,
      displayName: user?.displayName ?? null,
      email: user?.email ?? null,
    },
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, 'job_referrals'), docData);
  return ref.id;
}

function toTimestamp(d) {
  if (d instanceof Timestamp) return d;
  const date = d instanceof Date ? d : new Date(d);
  return Timestamp.fromDate(date);
}