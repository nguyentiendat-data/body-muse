"use client";
import Image from "next/image";
import { useState } from "react";
export function CampaignImage({src,alt,priority=false,className=""}:{src:string;alt:string;priority?:boolean;className?:string}) { const [failed,setFailed]=useState(false); return failed ? <div className="asset-pending"><span>BODY MUSE</span><p>{alt}</p><small>Ảnh chính thức đang được cập nhật</small></div> : <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 50vw" className={className} onError={()=>setFailed(true)} />; }
