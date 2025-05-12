import React from "react";
import Loader from "react-loaders";

export default function LoadingComponent() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        width: "100%",
        background: "black",
      }}
    >
      <Loader type="ball-scale" />
    </div>
  );
}
