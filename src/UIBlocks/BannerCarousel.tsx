import BallCanvas from "@/AnimationComponents/BallAnimation";
import ImageButton from "@/Components/Button/ImageBtn";
import apiClient from "@/pages/app/api/apiClients";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface SlideContent {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  discount?: string;
}

interface BannerCarouselProps {
  api: string;
  autoPlay?: boolean;
  delay?: number; // milliseconds
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  api,
  autoPlay = true,
  delay = 6000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(delay / 1000);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  const [slides, setSlides] = useState<SlideContent[]>([]);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      // Step 1: Fetch all item names
      const response = await apiClient.get(`${api}`);

      const items = response.data.data || [];
      const baseApi = api.split("?")[0];

      // Step 2: Fetch full details for each item
      const detailPromises = items.map((item: any) => {
        const itemName = encodeURIComponent(item.name);
        const detailUrl = `${baseApi}/${itemName}`;
        return apiClient
          .get(detailUrl)
          .then((res) => res.data.data)
          .catch((err) => {
            console.warn(`Item not found: ${item.name}`, err);
            return null;
          });
      });

      const detailResponses = await Promise.all(detailPromises);
      const validItems = detailResponses.filter(Boolean);

      const formatted: SlideContent[] = validItems.map((item: any) => {
        return {
          id: item.name,
          title: item.display_name, // or item.item_name if you want full name
          image: `${item.image}`,
          description: item.short_describe,
          discount: item.slider_offer,
          price: item.price || item.standard_rate || 0,
        };
      });

      setSlides(formatted);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setRemainingTime(delay / 1000);
    startTimeRef.current = null;
  };

  const goToNext = () => {
    goToSlide((activeIndex + 1) % slides.length);
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / delay, 3);
    const remaining = Math.max((delay - elapsed) / 1000, 0);
    setRemainingTime(remaining);

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      goToNext();
    }
  };

  useEffect(() => {
    if (!autoPlay || slides.length === 0) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const remaining = Math.max((delay - elapsed) / 1000, 0);

      setRemainingTime(remaining);

      if (elapsed < delay) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        goToNext();
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      startTime = null;
    };
  }, [activeIndex, slides.length, autoPlay, delay]);

  const progressPercent = (1 - remainingTime / (delay / 1000)) * 100;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  const navigateProductPage = (id: string) => {
    navigate(`/productpage/${id}`);
  };
  return (
    <div className="relative w-full h-[400px] lg:h-[600px] bg-background overflow-hidden">
      {/* 🔹 Silk background layer */}
      {/* <div className="absolute inset-0 -z-10">
        <Silk
          speed={5}
          scale={1}
          color="#E8D9FB"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div> */}

      <div className="absolute z-10">
        <BallCanvas ballCount={7} />
      </div>

      {/* 🔹 Slides */}
      <div className="w-full h-full relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex transition-opacity border-y border-ring/30 duration-300 px-6 py-4 ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Left: Image */}
            <div className="w-1/2 h-full flex items-center justify-center">
              <img
                src={`https://dev.aaranerp.com/${slide.image}`}
                alt={`Slide ${index}`}
                className={`h-full w-full p-3 sm:p-10 object-contain ${
                  index === activeIndex
                    ? "animate__animated animate__zoomIn"
                    : ""
                }`}
              />
            </div>

            {/* Right: Text Content */}
            <div className="w-1/2 h-full flex flex-col justify-center items-start p-4 relative">
              <h2
                className={`text-2xl md:text-5xl lg:text-7xl font-bold text-black/80 mb-2 uppercase ${
                  index === activeIndex
                    ? "animate__animated animate__fadeInDown"
                    : ""
                }`}
              >
                {slide.title}
              </h2>
              <h2
                className={`text-sm md:text-xl text-black/80 mt-3 mb-2 line-clamp-2 ${
                  index === activeIndex
                    ? "animate__animated animate__fadeInUp"
                    : ""
                }`}
              >
                {slide.description}
              </h2>
              {slide.price && (
                <p
                  className={`text-md text-black/80 md:text-2xl mt-3 ${
                    index === activeIndex
                      ? "animate__animated animate__fadeInUp"
                      : ""
                  }`}
                >
                  Just ₹ {slide.price}
                </p>
              )}

              {slide.discount && (
                <p
                  className={`text-md text-black/80 md:text-2xl mt-3 ${
                    index === activeIndex
                      ? "animate__animated animate__fadeInUp"
                      : ""
                  }`}
                >
                  {slide.discount} % Offer
                </p>
              )}

              <button
                className={`mt-4 px-7 py-2 bg-blue-600 text-white text-sm md:text-lg rounded hover:bg-blue-700 transition ${
                  index === activeIndex
                    ? "animate__animated animate__zoomIn"
                    : ""
                }`}
                onClick={() => {
                  navigateProductPage(slide.id);
                }}
              >
                Shop Now
              </button>

              {/* Circular Timer */}
              <div className="absolute bottom-4 right-4">
                <svg width="50" height="50" className="text-black">
                  <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.05s linear" }}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fill="currentColor"
                    fontWeight="bold"
                  >
                    {Math.ceil(remainingTime)}s
                  </text>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === activeIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <ImageButton
        onClick={() =>
          goToSlide(activeIndex === 0 ? slides.length - 1 : activeIndex - 1)
        }
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/30 text-white p-2 sm:p-4 !rounded-full hover:bg-black/50 z-20 hidden md:block"
        icon={"left"}
      />
      <ImageButton
        onClick={() => goToSlide((activeIndex + 1) % slides.length)}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/30 text-white p-2 sm:p-4 !rounded-full hover:bg-black/50 z-20 hidden md:block"
        icon={"right"}
      />
    </div>
  );
};

export default BannerCarousel;
