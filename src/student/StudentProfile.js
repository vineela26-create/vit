import { useEffect, useMemo, useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinary";
import "./student.css";
import { auth, db } from "../firebase/firebase";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

export default function StudentProfile({ profile, onProfileSaved }) {
  const [edit, setEdit] = useState(false);

  const initial = useMemo(
    () => ({
      name: profile?.name ?? localStorage.getItem("student_name") ?? "",
      regNumber: profile?.regNumber ?? localStorage.getItem("student_regNo") ?? "",
      busNumber: profile?.busNumber ?? localStorage.getItem("student_busNo") ?? "",
      college: profile?.college ?? localStorage.getItem("student_college") ?? "",
      gender: profile?.gender ?? localStorage.getItem("student_gender") ?? "",
      photo: profile?.photo ?? localStorage.getItem("student_photo") ?? "",
      email: profile?.email ?? auth.currentUser?.email ?? "",
      uid: profile?.uid ?? auth.currentUser?.uid ?? "",
    }),
    [profile]
  );

  const [name, setName] = useState(initial.name);
  const [regNumber, setRegNumber] = useState(initial.regNumber);
  const [busNumber, setBusNumber] = useState(initial.busNumber);
  const [college, setCollege] = useState(initial.college);
  const [gender, setGender] = useState(initial.gender);
  const [photo, setPhoto] = useState(initial.photo);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    setName(initial.name);
    setRegNumber(initial.regNumber);
    setBusNumber(initial.busNumber);
    setCollege(initial.college);
    setGender(initial.gender)
    setPhoto(initial.photo);
  }, [initial.name, initial.regNumber, initial.busNumber, initial.college, initial.gender,initial.photo]);

  const saveProfile = async () => {
    let photoURL = photo;

    if (photoFile) {
      photoURL = await uploadToCloudinary(photoFile);
      if (!photoURL) {
        alert("Photo upload failed");
        return;
      }
      setPhoto(photoURL);
    }

    if (!regNumber?.trim()) {
      alert("Register Number is required.");
      return;
    }

    try {
      const userRef = doc(db, "users", initial.uid);
      await updateDoc(userRef, {
        name: name || "",
        regNumber: regNumber.trim().toUpperCase(),
        busNumber: busNumber || "",
        college: college || "",
        gender: gender || "",
        updatedAt: serverTimestamp(),
      });

      // Also update students collection for faculty scanner
      const normalizedRegNo = regNumber.trim().toUpperCase();
      const studentRef = doc(db, "students", normalizedRegNo);
      await setDoc(
        studentRef,
        {
          regNo: normalizedRegNo,
          name: name || "",
          busNo: busNumber || "",
          college: college || "",
          gender: gender || "", // ✅ added
          photo: photoURL || "",
          email: initial.email || "",
          uid: initial.uid || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch {
      alert("Failed to save profile to Firebase.");
      return;
    }

    // Cache for UI
    localStorage.setItem("student_name", name || "");
   localStorage.setItem("student_regNo", regNumber.trim().toUpperCase());
    localStorage.setItem("student_busNo", busNumber || "");
    localStorage.setItem("student_college", college || "");
    localStorage.setItem("student_gender", gender || ""); // ✅ added
    if (photoURL) localStorage.setItem("student_photo", photoURL);
    else localStorage.removeItem("student_photo");

    setEdit(false);
    onProfileSaved?.({
      ...(profile || {}),
      name: name || "",
      regNumber: regNumber.trim().toUpperCase(),
      busNumber: busNumber || "",
      college: college || "",
      gender: gender || "",
      photo: photoURL || "",
    });
    alert("Profile updated successfully");
  };

  return (
    <div className="card profile-card">
      <h2>Student Profile</h2>

      <div className="profile-vertical">
        <div className="profile-image-container">
          {photo ? (
            <img src={photo} alt="profile" className="profile-img" />
          ) : (
            <div className="profile-placeholder" />
          )}
        </div>

        <div className="profile-form">
          <label>Full Name</label>
          <input value={name} disabled={!edit} onChange={(e) => setName(e.target.value)} />

          <label>Registration Number</label>
          <input
            value={regNumber}
            disabled={!edit || !!profile?.regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
          />

          <label>Bus Number</label>
          <input value={busNumber} disabled={!edit} onChange={(e) => setBusNumber(e.target.value)} />

          <label>College</label>
          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "16px",
            }}
          >
            <option value="">Select College</option>
            <option value="VIT">VIT</option>
            <option value="SVECW">SVECW</option>
            <option value="Polytechnic">Polytechnic</option>
            <option value="Degree">Degree</option>
            <option value="MBA">MBA</option>
            <option value="Pharmacy">Pharmacy</option>
          </select>
           <label>Gender</label>
            <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "16px",
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">MALE</option>
<option value="Female">FEMALE</option>
            
          </select>

          {edit && (
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
          )}
        </div>

        <div className="profile-actions">
          {!edit ? (
            <button onClick={() => setEdit(true)}>Edit Profile</button>
          ) : (
            <button onClick={saveProfile}>Save Profile</button>
            
          )}
        </div>
      </div>
    </div>
  );
}
