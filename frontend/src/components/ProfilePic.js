import React, { useState, useEffect, useRef, useCallback } from "react";

export default function ProfilePic({ changeprofile }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  // Memoize the postPic function using useCallback
  const postPic = useCallback(() => {
    // Saving the post to MongoDB
    fetch("http://localhost:5000/uploadProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        changeprofile();
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, [url, changeprofile]); // url and changeprofile are dependencies

  // Posting image to Cloudinary
  useEffect(() => {
    const postDetails = () => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "cantacloud6");
      fetch("https://api.cloudinary.com/v1_1/cantacloud6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => setUrl(data.url))
        .catch((err) => console.log(err));
    };

    if (image) {
      postDetails();
    }
  }, [image]); // Only image is needed as a dependency

  // Trigger postPic when url changes
  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url, postPic]); // Include url and postPic in the dependency array

  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={handleClick}
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            onClick={() => {
              setUrl(null);
              postPic();
            }}
            style={{ color: "#ED4956" }}
          >
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={changeprofile}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
