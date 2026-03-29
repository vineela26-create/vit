export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset"); // EXACT NAME
  formData.append("cloud_name", "djlhr8crw"); // YOUR cloud name

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/djlhr8crw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("Cloudinary response:", data);

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
}
