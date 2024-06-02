import WebCam from "react-webcam";

export type webcamProps = {
  imgSrc: string | null;
  webcamRef: React.RefObject<WebCam>;
};

const ImageCapture = ({ webcamRef, imgSrc }: webcamProps) => {
  return (
    <div style={{ margin: 0 }}>
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <WebCam
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

export default ImageCapture;
