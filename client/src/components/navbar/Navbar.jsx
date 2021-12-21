import { Alert, IconButton, Modal, Snackbar } from "@mui/material";
import {
  Add,
  Close,
  Menu,
  Photo,
  Upload,
  ZoomOutMapOutlined,
} from "@mui/icons-material";
import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import axios from "axios";
import domain from "../../util/domain";

function Navbar() {
  const [Open, setOpen] = useState(false);
  const [ImageName, setImageName] = useState("");
  const [Image, setImage] = useState([]);
  const [ImageBase64String, setImageBase64String] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [ToggleMenu, setToggleMenu] = useState(false);
  const [ZoomOut, setZoomOut] = useState(false);

  const { User, getUser, LoggedUser } = useContext(UserContext);
  const navigate = useNavigate();

  let { vertical, horizontal, open } = state;

  function handleClick(newState) {
    setState({ open: true, ...newState });
  }

  function handleClose() {
    setState({ ...state, open: false });
  }

  async function logout(e) {
    e.preventDefault();

    await axios.get(`${domain}/auth/log_out`);
    getUser();
    navigate("/");
  }

  function encodeImageBase64(image) {
    let reader = new FileReader();
    if (image) {
      reader.readAsDataURL(image);
      reader.onload = () => {
        let Base64 = reader.result;
        setImageBase64String(Base64);
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    }
  }
  encodeImageBase64(Image[0]);

  async function upload(e) {
    e.preventDefault();

    const data = {
      imageName: ImageName,
      image: ImageBase64String,
    };

    try {
      await axios.post(`${domain}/image/images`, data);
      window.location.reload();
    } catch (err) {
      if (err.response) {
        if (err.response.data.err) {
          setErrorMessage(err.response.data.err);
        }
      }
      handleClick({
        vertical: "top",
        horizontal: "center",
      });
    }
  }

  return (
    <>
      <div className="gallery__navbar-container">
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={1000}
        >
          <Alert onClose={handleClose} severity="error">
            {ErrorMessage}
          </Alert>
        </Snackbar>
        <h1 className="gallery__navbar-container__logo">
          <Link to="/">theGALLERY</Link>
        </h1>
        <div className="gallery__navbar-container__menu">
          {User === null ? (
            <>
              <div className="gallery__navbar-container__menu-item">
                <Link
                  to="/signin"
                  className="gallery__navbar-container__menu-link"
                >
                  Sign In
                </Link>
              </div>
              <div className="gallery__navbar-container__menu-item">
                <Link
                  to="/signup"
                  className="gallery__navbar-container__menu-link__btn"
                >
                  Sign Up
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="gallery__navbar-container__menu-item">
                <IconButton
                  className="gallery__navbar-container__menu-item__addIcon"
                  onClick={() => setOpen(true)}
                >
                  <Add />
                </IconButton>
              </div>
              <div className="gallery__navbar-container__menu-item">
                <Link
                  to="/profile"
                  className="gallery__navbar-container__menu-link"
                >
                  {LoggedUser?.name}
                </Link>
              </div>
              <div className="gallery__navbar-container__menu-item">
                <button
                  onClick={logout}
                  className="gallery__navbar-container__menu__logoutBtn"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
        <div className="gallery__navbar-container__mobile-menu">
          {ToggleMenu ? (
            <Close onClick={() => setToggleMenu(false)} />
          ) : (
            <Menu onClick={() => setToggleMenu(true)} />
          )}
          {ToggleMenu && (
            <div className="gallery__navbar-container__mobile-menu__Menu">
              {User === null ? (
                <>
                  <div className="gallery__navbar-container__menu-item">
                    <Link
                      to="/signin"
                      className="gallery__navbar-container__menu-link"
                    >
                      Sign In
                    </Link>
                  </div>
                  <div className="gallery__navbar-container__menu-item">
                    <Link
                      to="/signup"
                      className="gallery__navbar-container__menu-link__btn"
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="gallery__navbar-container__menu-item">
                    <IconButton
                      className="gallery__navbar-container__menu-item__addIcon"
                      onClick={() => setOpen(true)}
                    >
                      <Add />
                    </IconButton>
                  </div>
                  <div className="gallery__navbar-container__menu-item">
                    <Link
                      to="/profile"
                      className="gallery__navbar-container__menu-link"
                    >
                      My Account
                    </Link>
                  </div>
                  <div className="gallery__navbar-container__menu-item">
                    <button
                      onClick={logout}
                      className="gallery__navbar-container__menu__logoutBtn"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal open={Open}>
        <div className="gallery__upload-container">
          <IconButton
            className="gallery__upload-container__closeBtn"
            onClick={() => setOpen(false)}
          >
            <Close />
          </IconButton>
          <div className="gallery__upload-container__image">
            <ZoomOutMapOutlined
              className="gallery__upload-container__image__zoomOut-icon"
              onClick={() => setZoomOut(!ZoomOut)}
            />
            {ImageBase64String ? (
              <img
                src={ImageBase64String}
                alt="upload"
                className={
                  ZoomOut ? "gallery__upload-container__image__zoomOut" : "img"
                }
              />
            ) : (
              <img src="https://picsum.photos/400/700" alt="" className="img" />
            )}
            <div className="gallery__upload-container__input-container">
              <div className="gallery__upload-container__input">
                <div className="gallery__upload-container__image__chooseFile">
                  <Photo />
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Enter a name for your image"
                  value={ImageName}
                  onChange={(e) => setImageName(e.target.value)}
                />
              </div>
              <IconButton onClick={upload}>
                <Upload />
              </IconButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
