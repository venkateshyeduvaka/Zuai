const url = `https://api.cloudinary.com/v1_1/dwhep9ts2/image/upload`;

const uploadImageToCloudinary = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "venkatesh");

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

export default uploadImageToCloudinary;