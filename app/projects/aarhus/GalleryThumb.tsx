import Image from "next/image";

export default function GalleryThumb({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={94}
      height={94}
      sizes="94px"
      draggable={false}
    />
  );
}
