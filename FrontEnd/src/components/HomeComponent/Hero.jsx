import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useSelector } from "react-redux";
export default function Hero() {
  const floatingItems = [
    { icon: "📚", delay: 0 },
    { icon: "✏️", delay: 0.5 },
    { icon: "🎓", delay: 1 },
    { icon: "🌟", delay: 1.5 },
    { icon: "🔤", delay: 2 },
  ];

  const images = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
    "/images/image4.jpg",
  ];

  return (
    <motion.section className="flex items-center justify-center py-16 px-8">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Section */}
          <div className="space-y-8 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-blue10 tracking-tight"
              style={{ lineHeight: "1.2" }}
            >
              Challenge Yourself,
              <br />
              <span className="text-indigo-600">Ace the Test</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-900 dark:text-gray-200 max-w-3xl"
            >
              <TypeAnimation
                sequence={[
                  "Take our tailored tests to boost your English skills.",
                  1000,
                  "Perfect for students and teachers alike.",
                  1000,
                  "Master English with us!",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                style={{ fontSize: "1.5rem", display: "inline-block" }}
                repeat={Infinity}
              />
            </motion.p>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <CheckIcon className="text-green-500" />
                <span className="text-gray-700 dark:text-blue9">
                  Personalized Tests
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="text-green-500" />
                <span className="text-gray-700 dark:text-blue9">
                  Instant Feedback
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="text-green-500" />
                <span className="text-gray-700 dark:text-blue9">
                  Track Progress
                </span>
              </div>
            </motion.div>

            {/* Button Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                to="/start-test"
                className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-transform duration-300 text-white px-8 py-3 rounded-md text-lg font-semibold inline-block"
              >
                Start Your Test Now
              </Link>
            </motion.div>
          </div>

          {/* Image and Floating Icons Section */}
          <div className="relative h-[400px] md:h-[500px] z-0">
            {/* Image Carousel */}
            <div className="shadow-2xl rounded-lg overflow-hidden h-full">
              <ImageShow images={images} />
            </div>

            {/* Floating Icons */}
            {floatingItems.map((item, index) => (
              <motion.div
                key={index}
                className="absolute text-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: item.delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2,
                }}
                style={{
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const ImageShow = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const isDarkMode = useSelector((state) => state.app.isDarkMode);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-full group">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover shadow-2xl rounded-lg transition-opacity duration-500 ${
            index === currentImage ? "opacity-100 scale-105" : "opacity-0"
          } dark:dark-filter`}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentImage ? "bg-blue-600 w-4" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export { ImageShow };
