import axios from "axios";
import { Avatar, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./profile.css";
import domain from "../../util/domain.js";

function Profile() {
  const [LoggedUser, setLoggedUser] = useState({
    name: "",
    avatar: "",
  });
  const [Image, setImage] = useState([]);

  const [UserAvatar, setUserAvatar] = useState([]);
  const [AvatarBase64String, setAvatarBase64String] = useState("");

  useEffect(() => {
    getLoggedUser();
    getImage();
    // eslint-disable-next-line
  }, []);

  async function getLoggedUser() {
    const res = await axios.get(`${domain}/auth/loggedUser`);
    setLoggedUser(res.data);
  }

  async function getImage() {
    const res = await axios.get(`${domain}/image/a_image`);
    setImage(res.data);
  }

  function encodeAvatareBase64(avatar) {
    let reader = new FileReader();
    if (avatar) {
      reader.readAsDataURL(avatar);
      reader.onload = () => {
        let Base64 = reader.result;
        setAvatarBase64String(Base64);
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    }
  }
  encodeAvatareBase64(UserAvatar[0]);

  async function update(e) {
    e.preventDefault();

    const data = {
      avatar: AvatarBase64String,
    };

    await axios.put(`${domain}/auth/update`, data);
    getLoggedUser();
  }

  function renderImage() {
    let sortedImage = [...Image];
    sortedImage = sortedImage.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return sortedImage.map((image) => {
      return (
        <Tooltip key={image._id} title={image.imageName} followCursor>
          <div className="gallery__user-container__posts-post">
            <img src={image.image} alt="post" />
          </div>
        </Tooltip>
      );
    });
  }

  return (
    <div className="gallery__user-container">
      <div className="gallery__user-container__wrapper">
        <div className="gallery__user-container__header">
          <Avatar src={LoggedUser.avatar} />
          <div className="gallery__user-container__header-content">
            <h2>{LoggedUser.name}</h2>
            <div className="gallery__user-container__header__btns">
              <div className="gallery__user-container__header__btns-chooseFile">
                <button className="gallery__user-container__header__btns-editBtn">
                  Edit Photo
                </button>
                <input
                  type="file"
                  onChange={(e) => setUserAvatar(e.target.files)}
                />
              </div>
              {AvatarBase64String && (
                <button
                  onClick={update}
                  className="gallery__user-container__header__btns-updateBtn"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="gallery__user-container__posts">{renderImage()}</div>
      </div>
    </div>
  );
}

export default Profile;
