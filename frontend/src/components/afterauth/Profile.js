import axios from "axios";
import React, { useEffect, useState } from "react";
import "./profile.css";
import { Checkbox, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const refresh = () => window.location.reload(true);

  const Profunc = () => {
    const [email, setEmail] = useState(userInfo.email);
    const [lastname, setLastname] = useState(userInfo.lastname);
    const [firstname, setFirstname] = useState(userInfo.firstname);
    const [password, setPassword] = useState("");
    const [discription, setDiscription] = useState(userInfo.discription || "");
    const [image, setImage] = useState(
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    );

    const [error, setError] = useState();
    const [dialog, setDialog] = useState(false);
    const [checked, setChecked] = useState(false);
    const [token, setToken] = useState(
      JSON.parse(localStorage.getItem("userToken"))
    );

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

    const handlePassword = async (e) => {
      e.preventDefault();
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.put(
          `/password/${userInfo._id}`,
          {
            password,
          },
          config
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        setUserInfo(data);
        console.log(data);
        refresh();
      } catch (err) {
        console.log(err);
      }
    };

    const handleImage = async (e) => {
      setImage(e.target.files[0]);
      const base64 = await convertToBase64(e.target.files[0]);
      uploadImage(base64);
    };

    const uploadImage = async (file) => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.put(
          `/updateimage/${userInfo._id}`,
          {
            file,
          },
          config
        );
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        setUserInfo(data.user);
        console.log(data.message);
        refresh();
      } catch (err) {
        console.log(err);
      }
    };

    const submithandler = async (e) => {
      e.preventDefault();
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.put(
          `/updates/${userInfo._id}`,
          {
            email,
            lastname,
            firstname,
            discription,
          },
          config
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        setUserInfo(data);
        console.log(data);
        refresh();
      } catch (err) {
        console.log("error : ", err);
      }
    };

    return (
      <>
        <section className="profile">
          <div className="profile-box">
            <label htmlFor="Image" className="profile-img">
              <img src={userInfo.profileImage || image} alt="" />
              <input
                type="file"
                name=""
                id="Image"
                accept="image/*"
                onChange={handleImage}
              />
            </label>

            <div className="self-details">
              <h3>{userInfo.email}</h3>
              <h2 className="name">
                {userInfo.firstname} {userInfo.lastname}
              </h2>
              <p className="sort-des">{discription}</p>
              <p style={{ color: "red", fontSize: 12, fontWeight: "bolder" }}>
                *Click on profile pic to change it
              </p>
            </div>
            <h4 onClick={() => setDialog(true)} className="profile-edit btn">
              Edit
            </h4>
          </div>
        </section>
        <>
          <Dialog
            fullWidth={false}
            maxWidth="xl"
            open={dialog}
            onClose={() => setDialog(false)}
            className="dialog"
          >
            <form className="form" onSubmit={submithandler} action="">
              <h2>Update</h2>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                name="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
              <label htmlFor="firstname">Sort Info (in 20 words)</label>
              <input
                type="text"
                name="discription"
                id="discription"
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
                required
              />
              <button onClick={() => setDialog(dialog)}>Save</button>
            </form>
            <span>
              {" "}
              <p>Change password</p>
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </span>

            {checked && (
              <form action="" onSubmit={handlePassword} className="form">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <div className="password error"></div>
                <button>Save</button>
              </form>
            )}
          </Dialog>
        </>
      </>
    );
  };

  if (userInfo) {
    return <Profunc />;
  }
}

export default Profile;
