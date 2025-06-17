import { useEffect, useState } from "react";

const ImageComponent = ({ src, width, height, className }) => {
  const [currentSrc, setCurrentSrc] = useState(
    `https://placehold.co/${width}x${height}?text=Loading...`,
  );

  useEffect(() => {
    const img = new Image();
    if (src) {
      img.src = src;
      img.onload = () => {
        setCurrentSrc(src);
      };
      return;
    }
    setCurrentSrc(`https://placehold.co/${width}x${height}?text=No Image`);
    return () => {
      // Clean up function //
      img.onload = null;
    };
  }, [src, width, height]);

  return (
    <img
      className={
        currentSrc === src || !src ? className : `${className} blur-md`
      }
      width={width}
      height={height}
      src={currentSrc}
      alt=""
    />
  );
};
export default ImageComponent;
