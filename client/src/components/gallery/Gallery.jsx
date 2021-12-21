import React, { useContext, useEffect, useState } from "react";
import WelcomeScreen from "../welcomeScreen/WelcomeScreen";
import UserContext from "../../context/UserContext";
import "./gallery.css";
import axios from "axios";
import Image from "./Image";
import domain from "../../util/domain";

function Gallery() {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    getPhotos();
  }, []);

  const { User } = useContext(UserContext);

  async function getPhotos() {
    const res = await axios.get(`${domain}/image/images`);
    setImages(res.data);
  }

  function renderImages() {
    let sortedImages = [...Images];
    sortedImages = sortedImages.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return sortedImages.map((image) => {
      return <Image key={image._id} image={image} getPhotos={getPhotos} />;
    });
  }

  return User !== null ? (
    <div className="gallery-container">
      <div className="gallery-container__posts">{renderImages()}</div>
    </div>
  ) : (
    <>
      <WelcomeScreen />
      <div className="gallery-container">
        <div className="gallery-container__posts">{renderImages()}</div>
      </div>
    </>
  );
}

export default Gallery;
