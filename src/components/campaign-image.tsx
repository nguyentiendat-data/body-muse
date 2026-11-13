"use client";
import Image from "next/image";
import { useState } from "react";

export function CampaignImage({ src, alt, priority = false, className = "", cropRollOn = false, sizes = "(max-width: 768px) 100vw, 50vw" }: { src: string; alt: string; priority?: boolean; className?: string; cropRollOn?: boolean; sizes?: string }) {
  const [failedSource, setFailedSource] = useState("");
  if (failedSource === src) return <div className="asset-pending"><span>BODY MUSE</span><p>{alt}</p><small>Ảnh chính thức đang được cập nhật</small></div>;
  const picture = <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} onError={() => setFailedSource(src)} />;
  return cropRollOn ? <div className="roll-on-stage"><div className="roll-on-crop"><div className="roll-on-source">{picture}</div></div></div> : picture;
}
