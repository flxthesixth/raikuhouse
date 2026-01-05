"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

// Path from public folder
const RaikuCardBg = "/RaikuCard.png";

const roles = [
  "CHILLI",
  "SPICE CHAD",
  "SPICE KING",
  "Ambassador",
  "DEVELOPER",
  "PARTNER",
];

const templates = [
  { id: "spicenet", name: "Spicenet" },
  { id: "raiku", name: "Raiku" },
];

interface CardData {
  name: string;
  role: string;
  bio: string;
  profileImage: string | null;
  twitter: string;
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("spicenet");
  const frontCardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!name || !selectedRole) {
      alert("Please fill in your name and select a role");
      return;
    }
    const data = {
      name,
      role: selectedRole,
      bio,
      profileImage,
      twitter,
    };
    setCardData(data);
    localStorage.setItem("cardData", JSON.stringify(data));
  };

  const handleDownload = async () => {
    if (!frontCardRef.current || !cardData) return;
    setIsDownloading(true);
    
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
    } catch (error) {
      console.error("Failed to download:", error);
      alert("Failed to download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

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

  const handleViewDetail = () => {
    if (!cardData) return;
    localStorage.setItem("cardData", JSON.stringify(cardData));
    router.push("/detail");
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full bg-black">
      <div className="flex flex-col w-full lg:max-w-[922px] bg-[#0E0D0B] p-8 lg:p-[64px] min-h-screen font-mono">
        <header className="flex justify-between items-center mb-[25px]">
          <div>
            <a href="https://spicenet.io">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b641b677-554e-47b3-8297-85009f0b5d0c-card-spicenet-io/assets/icons/logo-1.png"
                alt="Logo"
                className="w-[24px] h-[35px] object-contain"
              />
            </a>
          </div>
          <div className="flex gap-[40px] items-center">
            <a
              href="https://x.com/spicenetio"
              className="text-[#EFE9E6] text-[19.2px] hover:text-white transition-colors"
            >
              X
            </a>
            <a
              href="https://docs.spicenet.io"
              className="text-[#EFE9E6] text-[19.2px] hover:text-white transition-colors"
            >
              Documentation
            </a>
          </div>
        </header>

        <div className="flex items-center mb-[25px]">
          <span className="flex items-center justify-center bg-white text-black text-[19.2px] font-bold w-[42px] h-[31px] mr-[15px]">
            1
          </span>
          <h2 className="text-[28px] font-medium font-sans text-white leading-tight">
            Complete Your Raiku ID-Card
          </h2>
        </div>

        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col">
            <label className="text-[#A0A0A0] text-[12.8px] font-medium uppercase mb-[8px] tracking-wider">
              YOUR NAME <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mr. Felix"
              className="bg-[#181715] border border-[#222222] text-white p-[15px] text-[15.2px] w-full outline-none focus:border-[#444444] placeholder-[#444444]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#A0A0A0] text-[12.8px] font-medium uppercase mb-[8px] tracking-wider">
              YOUR ROLE <span className="text-[#FF3B30]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-[0px]">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`border border-[#222222] p-[12px] text-[13.6px] uppercase tracking-wide transition-colors text-center ${
                    selectedRole === role
                      ? "bg-white text-black"
                      : "bg-[#0E0D0B] text-[#A0A0A0] hover:text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A0A0A0] text-[12.8px] font-medium uppercase mb-[8px] tracking-wider">
              UPLOAD PROFILE PICTURE <span className="text-[#FF3B30]">*</span>
            </label>
            <div className="relative group">
              <label className="flex items-center justify-center border border-dashed border-[#222222] bg-[#0E0D0B] h-[120px] cursor-pointer hover:border-[#444444] transition-colors overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Preview" className="h-full object-cover" />
                ) : (
                  <span className="text-[#A0A0A0] text-[13.6px] uppercase tracking-wide">
                    + UPLOAD PROFILE PICTURE
                  </span>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          <div className="relative flex items-center justify-center py-[20px]">
            <div className="w-full border-t border-[#1A1A1A]"></div>
            <span className="absolute bg-[#0E0D0B] px-4 text-[#666666] text-[12px] tracking-widest font-bold">
              OR
            </span>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A0A0A0] text-[12.8px] font-medium uppercase mb-[8px] tracking-wider">
              TWITTER ID
            </label>
            <div className="flex">
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@PeprikaInferno"
                className="bg-[#181715] border border-[#222222] text-white p-[15px] text-[15.2px] flex-grow outline-none focus:border-[#444444] placeholder-[#444444]"
              />
              <button className="bg-[#333333] hover:bg-[#444444] text-white text-[13.6px] font-bold px-[25px] border border-[#222222] ml-[-1px] transition-colors">
                FETCH
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A0A0A0] text-[12.8px] font-medium uppercase mb-[8px] tracking-wider">
              BIO
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="bg-[#181715] border border-[#222222] text-white p-[15px] text-[15.2px] w-full h-[100px] outline-none focus:border-[#444444] placeholder-[#444444] resize-none"
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label className="text-[#A0A0A0] text-[12.8px] font-medium uppercase mb-[8px] tracking-wider">
              CARD TEMPLATE
            </label>
            <div className="flex gap-[12px]">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`flex-1 py-[12px] px-[16px] text-[13px] font-bold tracking-wider border transition-all ${
                    selectedTemplate === template.id
                      ? "bg-[#FF6B35] border-[#FF6B35] text-black"
                      : "bg-[#181715] border-[#222222] text-white hover:border-[#444444]"
                  }`}
                >
                  {template.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={handleGenerate}
            className="relative w-full bg-[#181715] border border-[#222222] text-white text-[13px] font-bold py-[18px] tracking-[0.2em] transition-all hover:bg-[#222222] active:scale-[0.99] mt-[10px]"
          >
            GENERATE YOUR ID
            <span className="absolute bottom-0 right-0 w-[4px] h-[4px] bg-white mr-[-1px] mb-[-1px]"></span>
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-[#000000] min-h-screen px-[40px] md:px-[64px] py-[64px] relative overflow-hidden">
        <div className="flex items-center mb-[60px] md:mb-[80px] self-center md:self-start md:ml-[15%]">
          <span className="flex items-center justify-center w-[24px] h-[24px] bg-white text-black font-mono font-bold text-[14px] mr-[12px]">
            2
          </span>
          <h2 className="text-[24px] md:text-[28px] font-sans font-medium text-white tracking-tight">
            Preview
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="flex flex-row gap-[24px] items-center justify-center max-w-full overflow-hidden">
            {cardData ? (
              <>
                <div 
                  ref={frontCardRef}
                  className="relative w-[280px] md:w-[320px] aspect-[2/3] overflow-hidden flex flex-col"
                  style={selectedTemplate === "raiku" ? {
                    backgroundImage: `url("/RaikuCard.png")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "2px solid #f59e0b",
                  } : {
                    backgroundColor: "#0B0B0B",
                    border: "1px solid #333",
                  }}
                >
                  {selectedTemplate === "spicenet" && (
                    <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#1a1a1a] to-transparent"></div>
                  )}
                  
                  <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                    {cardData.profileImage ? (
                      <div className={`w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden mb-4 ${
                        selectedTemplate === "raiku" ? "border-4 border-yellow-400 shadow-lg shadow-yellow-400/30" : "border-2 border-[#333]"
                      }`}>
                        <img src={cardData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full mb-4 flex items-center justify-center ${
                        selectedTemplate === "raiku" 
                          ? "bg-black/50 border-4 border-yellow-400 shadow-lg shadow-yellow-400/30" 
                          : "bg-[#222] border-2 border-[#333]"
                      }`}>
                        <span className={`text-3xl font-bold ${selectedTemplate === "raiku" ? "text-yellow-400" : "text-[#666]"}`}>
                          {cardData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <h3 className={`text-xl md:text-2xl font-bold text-center mb-2 ${
                      selectedTemplate === "raiku" ? "text-yellow-400 drop-shadow-lg" : "text-white"
                    }`}>{cardData.name}</h3>
                    <span className={`text-xs md:text-sm font-mono uppercase tracking-wider mb-4 ${
                      selectedTemplate === "raiku" ? "text-white bg-yellow-500/80 px-3 py-1 rounded" : "text-[#FF6B35]"
                    }`}>{cardData.role}</span>
                    
                    {cardData.twitter && (
                      <span className={`text-xs font-mono ${
                        selectedTemplate === "raiku" ? "text-yellow-200" : "text-[#666]"
                      }`}>{cardData.twitter}</span>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    {selectedTemplate === "raiku" ? (
                      <span className="text-yellow-400 text-[12px] font-bold tracking-widest drop-shadow-lg">RAIKU</span>
                    ) : (
                      <img
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/b641b677-554e-47b3-8297-85009f0b5d0c-card-spicenet-io/assets/icons/logo-1.png"
                        alt="Logo"
                        className="w-[16px] h-[24px] object-contain opacity-50"
                      />
                    )}
                  </div>
                </div>

                <div className="relative w-[280px] md:w-[320px] aspect-[2/3] bg-[#0B0B0B] border border-[#333] overflow-hidden hidden sm:flex flex-col">
                  <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#1a1a1a] to-transparent"></div>
                  
                  <div className="flex-1 flex flex-col p-6 relative z-10">
                    <div className="mb-4">
                      <span className="text-[#666] text-[10px] font-mono uppercase tracking-wider">NAME</span>
                      <p className="text-white text-sm font-medium">{cardData.name}</p>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-[#666] text-[10px] font-mono uppercase tracking-wider">ROLE</span>
                      <p className="text-[#FF6B35] text-sm font-medium">{cardData.role}</p>
                    </div>
                    
                    {cardData.twitter && (
                      <div className="mb-4">
                        <span className="text-[#666] text-[10px] font-mono uppercase tracking-wider">TWITTER</span>
                        <p className="text-white text-sm font-medium">{cardData.twitter}</p>
                      </div>
                    )}
                    
                    {cardData.bio && (
                      <div className="mb-4 flex-1">
                        <span className="text-[#666] text-[10px] font-mono uppercase tracking-wider">BIO</span>
                        <p className="text-[#999] text-xs leading-relaxed mt-1">{cardData.bio}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <span className="text-[#444] text-[10px] font-mono tracking-widest">SPICENET.IO</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative w-[280px] md:w-[320px] aspect-[2/3] bg-[#0B0B0B] border border-[#222222] overflow-hidden">
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: 'linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.05) 50%, transparent 65%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2.5s infinite',
                    }}
                  />
                </div>

                <div className="relative w-[280px] md:w-[320px] aspect-[2/3] bg-[#0B0B0B] border border-[#222222] overflow-hidden hidden sm:block">
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: 'linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.05) 50%, transparent 65%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2.5s infinite',
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {cardData && (
            <div className="flex gap-4 mt-8 flex-wrap justify-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-6 py-3 bg-[#ff6b6b] text-black font-mono text-sm font-bold tracking-wider hover:opacity-85 transition-opacity disabled:opacity-50"
              >
                {isDownloading ? "DOWNLOADING..." : "DOWNLOAD"}
              </button>
              <button
                onClick={handleShareTwitter}
                className="px-6 py-3 bg-[#1DA1F2] text-white font-mono text-sm font-bold tracking-wider hover:opacity-85 transition-opacity"
              >
                SHARE ON X
              </button>
              <button
                onClick={handleViewDetail}
                className="px-6 py-3 bg-transparent border border-[#ff6b6b] text-[#ff6b6b] font-mono text-sm font-bold tracking-wider hover:bg-[#ff6b6b] hover:text-black transition-all"
              >
                VIEW DETAIL
              </button>
            </div>
          )}
        </div>

        <footer className="mt-auto pt-[40px] flex justify-center w-full">
          <a 
            href="https://spicenet.io" 
            className="font-mono text-[10px] md:text-[11px] text-[#666666] tracking-[0.2em] hover:text-white transition-colors duration-200"
          >
            SPICENET.IO
          </a>
        </footer>
      </div>
    </main>
  );
}
