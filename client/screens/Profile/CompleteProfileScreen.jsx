// // client/screens/Profile/CompleteProfileScreen.jsx
// import React, { useContext, useEffect, useMemo } from "react";
// import {
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Text,
//   TextInput,
//   Switch,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../services/firebase";
// import AuthContext, { useAuth } from "../../context/AuthContext";
// import { useUserProfile } from "../../hooks/useUserProfile";
// import ProgressHeader from "../../components/profile/ProgressHeader";
// import FormStepper from "../../components/profile/FormStepper";
// import Dropdown from "../../components/Dropdown";
// import PhoneInput from "../../components/profile/PhoneInput";
// import YearRangePicker from "../../components/profile/YearRangePicker";
// import ChipGroup from "../../components/profile/ChipGroup";
// import LocationPicker from "../../components/Location/LocationPicker";
// import ProfileAvatar from "../../components/ProfileAvatar";

// const ROLES = [
//   "Intern",
//   "Junior",
//   "Mid",
//   "Senior",
//   "Lead",
//   "Manager",
//   "Founder",
//   "CEO",
//   "CTO",
//   "Other",
// ];
// const INDUSTRIES = [
//   { id: "it", label: "IT / Software" },
//   { id: "finance", label: "Finance" },
//   { id: "fashion", label: "Fashion" },
//   { id: "healthcare", label: "Healthcare" },
//   { id: "education", label: "Education" },
// ];
// const IT_SUBINTERESTS = [
//   "GenAI",
//   "Full-Stack",
//   "Mobile",
//   "Data Engineering",
//   "Cloud",
//   "Security",
// ];
// const STEPS = ["Basics", "Education", "Experience", "Interests", "Review"];

// const defaultValues = {
//   full_name: { first_name: "", last_name: "" },
//   email_address: "",
//   phone_number: { country_code: "+1", number: "" },
//   native_location: { country: "", state: "", city: "", zip: "" },
//   immigrant: {
//     is_immigrant: false,
//     foreign_residence: { country: "", state: "", city: "", zip: "" },
//   },
//   education: [], // each: { degree, university_name, location:{...}, duration:{start_year,end_year}, gpa:{grade,scale} }
//   experience: [], // each: { company_name, role, industry, location:{...}, duration:{start_year,end_year} }
//   interests: { industries: [], it_sub: [], hobbies: [] },
// };

// export default function CompleteProfileScreen({ navigation }) {
//   const { user } = useContext(AuthContext);
//   const [step, setStep] = React.useState(0);
//   const [saving, setSaving] = React.useState(false);
//   const { profile, saveProfile, uploadAvatar } = useUserProfile();

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     getValues,
//     formState: { isSubmitting },
//   } = useForm({ defaultValues, mode: "onChange" });

//   const {
//     fields: eduFields,
//     append: eduAppend,
//     remove: eduRemove,
//   } = useFieldArray({ control, name: "education" });

//   const {
//     fields: expFields,
//     append: expAppend,
//     remove: expRemove,
//   } = useFieldArray({ control, name: "experience" });

//   useEffect(() => {
//     if (profile) {
//       reset(profile); // seeds form with profile state
//     }
//   }, [profile]);

//   // completeness calc
//   const progress = useMemo(() => {
//     const v = getValues();
//     let score = 0,
//       total = 8;
//     if (v.full_name.first_name) score++;
//     if (v.full_name.last_name) score++;
//     if (v.email_address) score++;
//     if (v.phone_number.number) score++;
//     if (v.native_location.country) score++;
//     if ((v.education || []).length) score++;
//     if ((v.experience || []).length) score++;
//     if (
//       (v.interests?.industries?.length || 0) +
//       (v.interests?.it_sub?.length || 0)
//     )
//       score++;
//     return Math.round((score / total) * 100);
//   }, [watch()]); // re-run on any change

//   const saveDraft = async () => {
//     try {
//       setSaving(true);
//       await saveProfile({ ...getValues(), completeness: progress });
//     } catch (e) {
//       Alert.alert("Save failed", e.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const publishProfile = async () => {
//     try {
//       setSaving(true);
//       await saveProfile(
//         { ...getValues(), completeness: progress },
//         { final: true }
//       );
//       Alert.alert("Success", "Your profile has been saved!");
//       navigation.goBack();
//     } catch (e) {
//       Alert.alert("Save failed", e.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const next = async () => {
//     await saveDraft();
//     setStep((s) => Math.min(s + 1, STEPS.length - 1));
//   };
//   const back = () => setStep((s) => Math.max(s - 1, 0));

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ProgressHeader
//         title="Complete Profile"
//         percent={progress}
//         saving={saving}
//         onClose={() => navigation.goBack()}
//       />
//       <FormStepper steps={STEPS} activeStep={step} onChange={setStep} />

//       <ScrollView className="px-4 pt-2">
//         {/* STEP 0: BASICS */}
//         {step === 0 && (
//           <Section title="Full Name">
//             <ProfileAvatar />
//             <Row>
//               <Controller
//                 control={control}
//                 name="full_name.first_name"
//                 rules={{ required: "First name is required" }}
//                 render={({ field: { onChange, value } }) => (
//                   <Input
//                     placeholder="First name"
//                     value={value}
//                     onChangeText={onChange}
//                   />
//                 )}
//               />
//               <Controller
//                 control={control}
//                 name="full_name.last_name"
//                 rules={{ required: "Last name is required" }}
//                 render={({ field: { onChange, value } }) => (
//                   <Input
//                     placeholder="Last name"
//                     value={value}
//                     onChangeText={onChange}
//                   />
//                 )}
//               />
//             </Row>

//             <Section title="Contact" nested>
//               <Controller
//                 control={control}
//                 name="email_address"
//                 rules={{
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                     message: "Enter a valid email",
//                   },
//                 }}
//                 render={({ field: { onChange, value } }) => (
//                   <Input
//                     placeholder="Email address"
//                     value={value}
//                     onChangeText={onChange}
//                     keyboardType="email-address"
//                   />
//                 )}
//               />

//               {/* Phone uses your PhoneInput, we bind it manually via setValue */}
//               <PhoneInput
//                 value={watch("phone_number")}
//                 onChange={(v) =>
//                   setValue("phone_number", v, { shouldDirty: true })
//                 }
//               />
//             </Section>

//             <Section title="Current Location" nested>
//               <LocationPicker
//                 control={control}
//                 setValue={setValue}
//                 watch={watch}
//                 namePrefix="native_location"
//                 label="Location"
//                 required
//               />
//             </Section>

//             <Section title="Immigration" nested>
//               <RowSpace>
//                 <Text className="text-gray-900">Are you an immigrant?</Text>
//                 <Controller
//                   control={control}
//                   name="immigrant.is_immigrant"
//                   render={({ field: { value, onChange } }) => (
//                     <Switch value={value} onValueChange={onChange} />
//                   )}
//                 />
//               </RowSpace>

//               {watch("immigrant.is_immigrant") && (
//                 <>
//                   <LocationPicker
//                     control={control}
//                     setValue={setValue}
//                     watch={watch}
//                     namePrefix="immigrant.foreign_residence"
//                     label="Foreign Country of Residence"
//                     required
//                   />
//                 </>
//               )}
//             </Section>
//           </Section>
//         )}

//         {/* STEP 1: EDUCATION */}
//         {step === 1 && (
//           <Section title="Education">
//             {eduFields.map((f, idx) => (
//               <Card key={f.id}>
//                 <Dropdown
//                   label="Degree"
//                   items={[
//                     { id: "Undergrad", label: "Undergrad" },
//                     { id: "Grad", label: "Grad" },
//                   ]}
//                   value={watch(`education.${idx}.degree`)}
//                   onSelect={(v) =>
//                     setValue(`education.${idx}.degree`, v, {
//                       shouldDirty: true,
//                     })
//                   }
//                 />
//                 <Controller
//                   control={control}
//                   name={`education.${idx}.university_name`}
//                   rules={{ required: "University name is required" }}
//                   render={({ field: { onChange, value } }) => (
//                     <Input
//                       placeholder="University name"
//                       value={value}
//                       onChangeText={onChange}
//                     />
//                   )}
//                 />
//                 {/* REQUIRED Location for education */}
//                 <LocationPicker
//                   control={control}
//                   setValue={setValue}
//                   watch={watch}
//                   namePrefix={`education.${idx}.location`}
//                   label="University Location"
//                   required
//                 />
//                 <YearRangePicker
//                   label="Duration"
//                   start={watch(`education.${idx}.duration.start_year`)}
//                   end={watch(`education.${idx}.duration.end_year`)}
//                   onChange={(s, e) => {
//                     setValue(`education.${idx}.duration.start_year`, s, {
//                       shouldDirty: true,
//                     });
//                     setValue(`education.${idx}.duration.end_year`, e, {
//                       shouldDirty: true,
//                     });
//                   }}
//                 />
//                 <Row>
//                   <Controller
//                     control={control}
//                     name={`education.${idx}.gpa.grade`}
//                     render={({ field: { onChange, value } }) => (
//                       <Input
//                         placeholder="GPA / Grade"
//                         value={value}
//                         onChangeText={onChange}
//                       />
//                     )}
//                   />
//                   <Dropdown
//                     label="Scale"
//                     items={[
//                       { id: "4", label: "/4" },
//                       { id: "10", label: "/10" },
//                     ]}
//                     value={watch(`education.${idx}.gpa.scale`) || "4"}
//                     onSelect={(v) =>
//                       setValue(`education.${idx}.gpa.scale`, v, {
//                         shouldDirty: true,
//                       })
//                     }
//                   />
//                 </Row>
//                 <Outlined onPress={() => eduRemove(idx)} danger>
//                   Remove
//                 </Outlined>
//               </Card>
//             ))}
//             <Primary
//               onPress={() => {
//                 eduAppend({
//                   degree: "Undergrad",
//                   university_name: "",
//                   location: { country: "", state: "", city: "", zip: "" },
//                   duration: { start_year: "", end_year: "" },
//                   gpa: { grade: "", scale: "4" },
//                 });
//               }}
//             >
//               Add Education
//             </Primary>
//           </Section>
//         )}

//         {/* STEP 2: EXPERIENCE */}
//         {step === 2 && (
//           <Section title="Experience">
//             {expFields.map((f, idx) => (
//               <Card key={f.id}>
//                 <Controller
//                   control={control}
//                   name={`experience.${idx}.company_name`}
//                   rules={{ required: "Company name is required" }}
//                   render={({ field: { onChange, value } }) => (
//                     <Input
//                       placeholder="Company name"
//                       value={value}
//                       onChangeText={onChange}
//                     />
//                   )}
//                 />
//                 <Dropdown
//                   label="Role / Position"
//                   items={ROLES.map((r) => ({ id: r, label: r }))}
//                   value={watch(`experience.${idx}.role`) || "Senior"}
//                   onSelect={(v) =>
//                     setValue(`experience.${idx}.role`, v, { shouldDirty: true })
//                   }
//                 />
//                 <Dropdown
//                   label="Industry"
//                   items={INDUSTRIES}
//                   value={watch(`experience.${idx}.industry`) || "it"}
//                   onSelect={(v) =>
//                     setValue(`experience.${idx}.industry`, v, {
//                       shouldDirty: true,
//                     })
//                   }
//                 />
//                 {/* REQUIRED Location for experience */}
//                 <LocationPicker
//                   control={control}
//                   setValue={setValue}
//                   watch={watch}
//                   namePrefix={`experience.${idx}.location`}
//                   label="Work Location"
//                   required
//                 />
//                 <YearRangePicker
//                   label="Duration"
//                   start={watch(`experience.${idx}.duration.start_year`)}
//                   end={watch(`experience.${idx}.duration.end_year`)}
//                   onChange={(s, e) => {
//                     setValue(`experience.${idx}.duration.start_year`, s, {
//                       shouldDirty: true,
//                     });
//                     setValue(`experience.${idx}.duration.end_year`, e, {
//                       shouldDirty: true,
//                     });
//                   }}
//                 />
//                 <Outlined onPress={() => expRemove(idx)} danger>
//                   Remove
//                 </Outlined>
//               </Card>
//             ))}
//             <Primary
//               onPress={() => {
//                 expAppend({
//                   company_name: "",
//                   role: "Senior",
//                   industry: "it",
//                   location: { country: "", state: "", city: "", zip: "" },
//                   duration: { start_year: "", end_year: "" },
//                 });
//               }}
//             >
//               Add Experience
//             </Primary>
//           </Section>
//         )}

//         {/* STEP 3: INTERESTS */}
//         {step === 3 && (
//           <Section title="Interests">
//             <Text className="text-gray-900 font-semibold mb-2">Industries</Text>
//             <ChipGroup
//               multi
//               options={INDUSTRIES}
//               value={watch("interests.industries")}
//               onChange={(v) =>
//                 setValue("interests.industries", v, { shouldDirty: true })
//               }
//             />
//             <View className="h-3" />
//             <Text className="text-gray-900 font-semibold mb-2">
//               IT Sub-Interests
//             </Text>
//             <ChipGroup
//               multi
//               options={IT_SUBINTERESTS.map((s) => ({ id: s, label: s }))}
//               value={watch("interests.it_sub")}
//               onChange={(v) =>
//                 setValue("interests.it_sub", v, { shouldDirty: true })
//               }
//             />
//             <View className="h-3" />
//             <Text className="text-gray-900 font-semibold mb-2">Hobbies</Text>
//             <ChipGroup
//               multi
//               freeInput
//               placeholder="Type hobby and add"
//               options={[]}
//               value={watch("interests.hobbies")}
//               onChange={(v) =>
//                 setValue("interests.hobbies", v, { shouldDirty: true })
//               }
//             />
//           </Section>
//         )}

//         {/* STEP 4: REVIEW */}
//         {step === 4 && (
//           <Section title="Review">
//             <Review
//               label="Name"
//               value={`${watch("full_name.first_name")} ${watch("full_name.last_name")}`.trim()}
//             />
//             <Review label="Email" value={watch("email_address")} />
//             <Review
//               label="Phone"
//               value={`${watch("phone_number.country_code")} ${watch("phone_number.number")}`}
//             />
//             <Review
//               label="Current Location"
//               value={[
//                 watch("native_location.city"),
//                 watch("native_location.state"),
//                 watch("native_location.country"),
//               ]
//                 .filter(Boolean)
//                 .join(", ")}
//             />
//             {watch("immigrant.is_immigrant") && (
//               <>
//                 <Review
//                   label="Foreign Residence"
//                   value={[
//                     watch("immigrant.foreign_residence.city"),
//                     watch("immigrant.foreign_residence.state"),
//                     watch("immigrant.foreign_residence.country"),
//                   ]
//                     .filter(Boolean)
//                     .join(", ")}
//                 />
//               </>
//             )}
//             <Review label="Educations" value={`${eduFields.length} item(s)`} />
//             <Review label="Experience" value={`${expFields.length} item(s)`} />
//             <Review
//               label="Interests"
//               value={[
//                 ...(watch("interests.industries") || []),
//                 ...(watch("interests.it_sub") || []),
//               ].join(", ")}
//             />
//           </Section>
//         )}
//       </ScrollView>

//       {/* Bottom bar */}
//       <View className="px-4 py-3 border-t border-gray-100 bg-white flex-row items-center justify-between">
//         <Outlined disabled={step === 0} onPress={back}>
//           Back
//         </Outlined>
//         <View className="flex-row gap-3">
//           <Outlined onPress={saveDraft}>Save Draft</Outlined>
//           {step < STEPS.length - 1 ? (
//             <Primary onPress={next}>Continue</Primary>
//           ) : (
//             <Primary onPress={handleSubmit(publishProfile)}>
//               {isSubmitting ? "Saving…" : "Submit"}
//             </Primary>
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---------- tiny UI atoms ---------- */
// const Section = ({ title, children, nested }) => (
//   <View className={`${nested ? "" : "bg-gray-50"} rounded-2xl p-4 mb-4`}>
//     {title ? (
//       <Text className="text-gray-900 font-semibold mb-2">{title}</Text>
//     ) : null}
//     {children}
//   </View>
// );
// const Card = ({ children }) => (
//   <View className="bg-gray-50 rounded-2xl p-4 mb-3">{children}</View>
// );
// const Row = ({ children }) => (
//   <View className="flex-row gap-3">{children}</View>
// );
// const RowSpace = ({ children }) => (
//   <View className="flex-row items-center justify-between py-1">{children}</View>
// );
// const Input = (props) => (
//   <View className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex-1 mb-3">
//     <TextInput {...props} />
//   </View>
// );
// const Outlined = ({ children, onPress, disabled, danger }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     disabled={disabled}
//     className={`px-4 py-3 rounded-2xl ${danger ? "bg-red-100" : disabled ? "bg-gray-100" : "bg-gray-200"}`}
//   >
//     <Text
//       className={`${danger ? "text-red-600" : "text-gray-800"} font-medium`}
//     >
//       {children}
//     </Text>
//   </TouchableOpacity>
// );
// const Primary = ({ children, onPress }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     className="px-5 py-3 rounded-2xl bg-blue-600"
//   >
//     <Text className="text-white font-semibold">{children}</Text>
//   </TouchableOpacity>
// );
// const Review = ({ label, value }) => (
//   <View className="py-2 border-b border-gray-200">
//     <Text className="text-gray-500">{label}</Text>
//     <Text className="text-gray-900 font-medium">{value || "—"}</Text>
//   </View>
// );
