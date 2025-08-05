"use client";
import Image from "next/image";

export function SamandehiLogo() {
  const handleClick = () => {
    window.open(
      'https://logo.samandehi.ir/Verify.aspx?id=391969&p=xlaopfvlrfthpfvlgvkapfvl', 
      'Popup',
      'toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30'
    );
  };

  return (
    <Image 
      referrerPolicy="origin" 
      id="rgvjsizpjxlzsizpfukzsizp" 
      style={{ cursor: "pointer" }} 
      onClick={handleClick}
      alt="logo-samandehi" 
      src="https://logo.samandehi.ir/logo.aspx?id=391969&p=qftibsiynbpdbsiywlbqbsiy"
      width={120}
      height={60}
    />
  );
} 