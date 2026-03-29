import { useEffect, useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinary";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import "../faculty/faculty.css";

export default function FacultyProfile() {
  const [edit, setEdit] = useState(true);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [gender, setGender] = useState("");
  const [college, setCollege] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const profileRef = doc(db, "users", user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setName(data.name || user.displayName || "");
        setBusNumber(data.busNumber || "");
        setGender(data.gender || "");
        setCollege(data.college || "");
        setPhoto(data.photoURL || "");
      } else {
        setName(user.displayName || "");
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let photoURL = photo;
    if (photoFile) {
      const uploaded = await uploadToCloudinary(photoFile);
      if (!uploaded) {
        alert("Failed to upload photo.");
        return;
      }
      photoURL = uploaded;
      setPhoto(photoURL);
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          role: "faculty",
          name: name || "",
          busNumber: busNumber || "",
          gender: gender || "",
          college: college || "",
          photoURL: photoURL || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setEdit(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Unable to save profile.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="faculty-profile">
          <div className="faculty-profile-card">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="faculty-profile">
        <div className="faculty-profile-card">
          <h2>Faculty Profile</h2>

          <div className="profile-image-container">
            {photo ? (
              <img src={photo} alt="Profile" className="profile-img" />
            ) : (
              <div className="profile-placeholder" />
            )}
          </div>

          <div className="profile-form">
            <label>Full Name</label>
            <input value={name} disabled={!edit} onChange={(e) => setName(e.target.value)} />

            <label>Bus Number</label>
            <input value={busNumber} disabled={!edit} onChange={(e) => setBusNumber(e.target.value)} />

            <label>Gender</label>
            <select value={gender} disabled={!edit} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>College</label>
            <select value={college} disabled={!edit} onChange={(e) => setCollege(e.target.value)}>
              <option value="">Select College</option>
              <option value="VIT">VIT</option>
              <option value="SVECW">SVECW</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>

            {edit && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
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
    </div>
  );
}
