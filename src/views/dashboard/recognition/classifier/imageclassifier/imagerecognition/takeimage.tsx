import React from "react";
import Webcam from "react-webcam";

type takeimageprops = {
  imgSrc: string | null;
  webcamRef: React.RefObject<Webcam>;
};
const TakeImage = ({ imgSrc, webcamRef }: takeimageprops) => {
  return (
    <div style={{ margin: 0 }}>
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam
          height={400}
          width={500}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.8}
        />
      )}
    </div>
  );
};

export default TakeImage;
