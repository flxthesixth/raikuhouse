"use client";

import { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";

interface CardData {
  name: string;
  role: string;
  bio: string;
  profileImage: string | null;
  twitter: string;
}

export default function DetailPage() {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
//   const frontCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cardData");
    if (stored) {
      setCardData(JSON.parse(stored));
    }
  }, []);

//   const handleDownload = async () => {
//     if (!frontCardRef.current || !cardData) return;
//     setIsDownloading(true);
    
//     try {
//       const dataUrl = await toPng(frontCardRef.current, {
//         quality: 1,
//         pixelRatio: 2,
//         backgroundColor: "#0B0B0B",
//         cacheBust: true,
//       });
      
//       const link = document.createElement("a");
//       link.download = `${cardData.name}-spicenet-card.png`;
//       link.href = dataUrl;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Failed to download:", error);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

  const handleShareTwitter = async () => {
    if (!frontCardRef.current || !cardData) return;
    
    try {
      const dataUrl = await toPng(frontCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0B0B0B",
        cacheBust: true,
      });
      
      const link = document.createElement("a");
      link.download = `${cardData.name}-spicenet-card.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        const tweetText = `Check out my Spicenet ID Card! I'm a ${cardData.role} at @spicenetio 🌶️\n\nGenerate yours at card.spicenet.io`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: twitterUrl } }, "*");
      }, 500);
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  if (!cardData) {
    return (
      <div className="min-h-screen w-full flex bg-[#000000] font-mono">
        <main className="w-full max-w-[600px] p-8">
          <p className="text-[#F44336] text-[17.6px] leading-relaxed mb-8 max-w-[536px]">
            Card data not found. Please go back and generate a card.
          </p>
          <Link href="/">
            <button className="px-5 py-3 bg-[#ff6b6b] text-black font-mono text-sm font-medium">
              Back to Generator
            </button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#000000] font-mono flex flex-col">
      <header className="flex justify-between items-center p-8 md:px-16">
        <Link href="/">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b641b677-554e-47b3-8297-85009f0b5d0c-card-spicenet-io/assets/icons/logo-1.png"
            alt="Logo"
            width={24}
            height={35}
            className="object-contain"
          />
        </Link>
        <div className="flex gap-[24px] md:gap-[40px] items-center">
          <a
            href="https://x.com/spicenetio"
            className="text-[#EFE9E6] text-[16px] md:text-[19.2px] hover:text-white transition-colors"
          >
            X
          </a>
          <a
            href="https://docs.spicenet.io"
            className="text-[#EFE9E6] text-[16px] md:text-[19.2px] hover:text-white transition-colors"
          >
            Documentation
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-8">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <span className="flex items-center justify-center w-[32px] h-[32px] bg-white text-black font-mono font-bold text-[14px]">
            2
          </span>
          <h2 className="text-[24px] md:text-[28px] font-bold text-white tracking-tight leading-none font-sans">
            Your Spicenet ID
          </h2>
        </div>

        <div className="relative perspective-1000 mb-8 md:mb-12">
          <div 
            className={`relative transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div 
              ref={frontCardRef}
              className={`relative w-[300px] md:w-[380px] aspect-[2/3] bg-[#0B0B0B] border border-[#333] overflow-hidden flex flex-col ${isFlipped ? 'invisible' : ''}`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-[#1a1a1a] to-transparent"></div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                {cardData.profileImage ? (
                  <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden border-2 border-[#333] mb-6">
                    <img src={cardData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full bg-[#222] border-2 border-[#333] mb-6 flex items-center justify-center">
                    <span className="text-[#666] text-4xl md:text-5xl font-bold">{cardData.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                
                <h3 className="text-white text-2xl md:text-3xl font-bold text-center mb-3">{cardData.name}</h3>
                <span className="text-[#FF6B35] text-sm md:text-base font-mono uppercase tracking-wider mb-4">{cardData.role}</span>
                
                {cardData.twitter && (
                  <span className="text-[#666] text-sm font-mono">{cardData.twitter}</span>
                )}
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b641b677-554e-47b3-8297-85009f0b5d0c-card-spicenet-io/assets/icons/logo-1.png"
                  alt="Logo"
                  width={20}
                  height={30}
                  className="object-contain opacity-50"
                />
              </div>
            </div>

            <div 
              className={`absolute top-0 left-0 w-[300px] md:w-[380px] aspect-[2/3] bg-[#0B0B0B] border border-[#333] overflow-hidden flex flex-col ${!isFlipped ? 'invisible' : ''}`}
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#1a1a1a] to-transparent"></div>
              
              <div className="flex-1 flex flex-col p-8 relative z-10">
                <div className="mb-6">
                  <span className="text-[#666] text-[11px] font-mono uppercase tracking-wider">NAME</span>
                  <p className="text-white text-lg font-medium mt-1">{cardData.name}</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-[#666] text-[11px] font-mono uppercase tracking-wider">ROLE</span>
                  <p className="text-[#FF6B35] text-lg font-medium mt-1">{cardData.role}</p>
                </div>
                
                {cardData.twitter && (
                  <div className="mb-6">
                    <span className="text-[#666] text-[11px] font-mono uppercase tracking-wider">TWITTER</span>
                    <p className="text-white text-lg font-medium mt-1">{cardData.twitter}</p>
                  </div>
                )}
                
                {cardData.bio && (
                  <div className="mb-6 flex-1">
                    <span className="text-[#666] text-[11px] font-mono uppercase tracking-wider">BIO</span>
                    <p className="text-[#999] text-sm leading-relaxed mt-2">{cardData.bio}</p>
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <span className="text-[#444] text-[11px] font-mono tracking-widest">SPICENET.IO</span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-[#666] text-xs mt-4 font-mono">Click card to flip</p>
        </div>

        <div className="flex gap-3 md:gap-4 flex-wrap justify-center">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 md:px-8 py-3 md:py-4 bg-white text-black font-mono text-xs md:text-sm font-bold tracking-wider hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 uppercase"
          >
            {isDownloading ? "DOWNLOADING..." : "DOWNLOAD"}
          </button>
          <button
            onClick={handleShareTwitter}
            className="px-6 md:px-8 py-3 md:py-4 bg-[#1DA1F2] text-white font-mono text-xs md:text-sm font-bold tracking-wider hover:opacity-85 transition-opacity uppercase"
          >
            SHARE ON X
          </button>
          <Link href="/">
            <button className="px-6 md:px-8 py-3 md:py-4 bg-transparent border border-[#333] text-[#999] font-mono text-xs md:text-sm font-bold tracking-wider hover:border-[#666] hover:text-white transition-all uppercase">
              CREATE NEW
            </button>
          </Link>
        </div>
      </main>

      <footer className="py-10 flex justify-center">
        <a 
          href="https://spicenet.io" 
          className="font-mono text-[10px] md:text-[12px] text-[#757575] tracking-[0.1em] uppercase hover:text-white transition-colors duration-200"
        >
          SPICENET.IO
        </a>
      </footer>
    </div>
  );
}
