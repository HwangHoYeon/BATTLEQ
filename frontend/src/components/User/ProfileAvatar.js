import React, { useEffect, useContext } from "react";

import { UserStateContext } from "../../context/Context";
import axios from "axios";
import { useState } from "react";

const ProfileAvatar = (props) => {
  const { usersInfo } = useContext(UserStateContext);
  console.log(usersInfo);
  const [imgPreview, setImgPreview] = useState(null);
  const [uploadImg, setUploadImg] = useState(null);
  const [error, setError] = useState(false);
  const email = localStorage.getItem("email");

  useEffect(() => {
    setImgPreview(usersInfo.profileImg);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = new FormData();
    file.append("file", uploadImg);

    const headers = {
      accessToken: `${localStorage.getItem("accessToken")}`,
    };

    axios
      .post(`http://localhost:8080/api/v1/users/profile?email=${email}`, file, {
        headers,
      })
      .then((res) => {
        console.log(res);
        alert("사진이 등록되었습니다.");
      })
      .catch((err) => {
        console.log("실패");
        console.log(err);
        alert("지원되지 않는 형식입니다 / jpg파일을 등록해주세요.");
      });
  };

  const handleImageChange = (e) => {
    setError(false);
    const selected = e.target.files[0];
    setUploadImg(selected);

    const ALLOWED_TYPES = ["image/pg", "image/jpeg", "image/jpg"];
    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      console.log("selected", selected);
      console.log(email);
      let reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(selected);
    } else {
      setError(true);
      console.log("file not supported");
    }
  };
  console.log(imgPreview);
  console.log(usersInfo.profileImg);
  console.log(usersInfo);
  console.log(props.users);
  return (
    <div>
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={!imgPreview ? props.users.profileImg : imgPreview}
          className="w-full h-52 rounded-3xl"
        />
      </div>
      <div className="w-full h-10">
        <input
          // style={{ display: "none" }}
          id="file-input"
          type="file"
          name="imageFile"
          onChange={handleImageChange}
        />
      </div>
      <div className="w-full h-10 flex justify-center items-center">
        <button
          color="primary"
          fullWidth
          variant="text"
          component="label"
          onClick={handleSubmit}
        >
          <span className="text-xl font-medium">{"사진 등록"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileAvatar;
