import React from "react";

const Notification = (props) => {
  const { success, message } = props.errorMessage;

  const errStyle = {
    animationName: "popDown",
    animationDuration: "2.6s",
    animationTimingFunction: "ease-in-out",
  };

  if (success && message) {
    return (
      <p style={{ ...errStyle, color: "#00a550" }} className="pop-down">
        {message}
      </p>
    );
  } else if (!success && message) {
    return (
      <p style={{ ...errStyle, color: "#dc143c" }} className="pop-down">
        {message}
      </p>
    );
  } else {
    return null;
  }
};

export default Notification;
