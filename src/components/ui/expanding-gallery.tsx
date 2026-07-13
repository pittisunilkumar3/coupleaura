"use client";

export function ExpandingGallery() {
  const images = [
    "/images/bigday-traditional-video.jpg",
    "/images/pellikuthuru-traditional-video.jpg",
    "/images/pellikoduku-traditional-video.jpg",
    "/images/sangeet-traditional-video.jpg",
    "/images/reception-traditional-video.jpg",
    "/images/vratham-traditional-video.jpg",
    "/images/sangeet-no.jpg",
    "/images/sangeet-yes.jpg",
    "/images/album-magnum.jpg",
    "/images/album-pressbook.jpg",
  ];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: 400,
      width: "100%",
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 20px",
    }}>
      {images.map((src, idx) => (
        <div
          key={idx}
          style={{
            position: "relative",
            flex: "1 1 0%",
            height: "100%",
            borderRadius: 12,
            overflow: "hidden",
            cursor: "pointer",
            transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            minWidth: 0,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.flex = "5 1 0%";
            el.style.zIndex = "10";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.flex = "1 1 0%";
            el.style.zIndex = "1";
          }}
        >
          <img
            src={src}
            alt={`Gallery ${idx + 1}`}
            loading="lazy"
            draggable={false}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}
