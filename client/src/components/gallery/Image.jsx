import { Alert, Avatar, Snackbar, Tooltip } from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Download,
  DeleteOutline,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";

import "./gallery.css";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import axios from "axios";
import domain from "../../util/domain";

function Image({ image, getPhotos }) {
  const [IsLiked, setIsLiked] = useState(false);
  const [Liking, setLiking] = useState(true);
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { User, Users } = useContext(UserContext);

  let { vertical, horizontal, open } = state;

  useEffect(() => {
    setIsLiked(image.likes.includes(User));
  }, [image.likes, User]);

  function handleClick(newState) {
    setState({ open: true, ...newState });
  }

  function handleClose() {
    setState({ ...state, open: false });
  }

  async function likeHandler() {
    await axios.put(`${domain}/image/${image._id}/like`);
    setIsLiked(!IsLiked);
    handleClick({
      vertical: "top",
      horizontal: "center",
    });
  }

  async function delete_image() {
    await axios.delete(`${domain}/image/${image._id}/delete`);
    await getPhotos();
  }

  return (
    <>
      {IsLiked ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={2500}
        >
          <Alert onClose={handleClose} severity="info" variant="filled">
            You have liked this image.
          </Alert>
        </Snackbar>
      ) : (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={2500}
        >
          <Alert onClose={handleClose} severity="info" variant="filled">
            You have disliked this image.
          </Alert>
        </Snackbar>
      )}
      <div className="gallery-container__posts-post">
        <Tooltip title={image.imageName} followCursor>
          <img src={image.image} alt="post" />
        </Tooltip>
        <div className="gallery-container__posts-post__content">
          <Avatar src={Users.filter((u) => u._id === image.user)[0]?.avatar} />
          <span>{Users.filter((u) => u._id === image.user)[0]?.name}</span>
          {User !== null && (
            <div className="icons">
              {IsLiked ? (
                Liking && (
                  <span className="icon">
                    <Favorite
                      onClick={likeHandler}
                      style={{ color: "#dd4a48" }}
                    />
                  </span>
                )
              ) : (
                <span className="icon">
                  <FavoriteBorder onClick={likeHandler} />
                </span>
              )}
              <a href={image.image} download={image.imageName} className="icon">
                <Download />
              </a>
              {User === image.user && (
                <span className="icon">
                  <DeleteOutline onClick={delete_image} />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Image;
