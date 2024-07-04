import React, { useState } from "react";
import { storage } from "../../config/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styles from "./UploadImage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const UploadImage = ({ onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          onUploadComplete(downloadURL);
        });
      }
    );
  };

  return (
    <div className={cx("uploadImageContainer")}>
      <input
        type="file"
        onChange={handleImageChange}
        className={cx("inputFile")}
      />
      <button onClick={handleUpload} className={cx("uploadButton")}>
        Upload
      </button>
      {progress > 0 && <p>Upload is {progress}% done</p>}
      {/*{url && <img src={url} alt="Uploaded" className={cx("imagePreview")} />}*/}
    </div>
  );
};

export default UploadImage;
