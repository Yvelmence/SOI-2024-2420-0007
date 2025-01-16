import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate()
    const gotToNewPage = () => {
        navigate("/customer");
    }
    
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        dotsClass: "slick-dots custom-dots",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center">
            <style>
                {`
                    .custom-dots li button:before {
                        color: #ec4899 !important;
                        opacity: 0.25;
                        font-size: 12px;
                    }
                    
                    .custom-dots li.slick-active button:before {
                        color: #ec4899 !important;
                        opacity: 1;
                    }
                `}
            </style>
            <h1 className="text-6xl font-bold text-white mb-16 text-center tracking-wider">
                Learn about Tissues here!
            </h1>
            <div className="max-w-7xl w-full">
                <Slider {...settings}>
                    {data.map((d, index) => (
                        <div key={index} className="px-4 h-[500px]">
                            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl h-full flex flex-col transform transition-transform duration-300 hover:scale-105">
                                <div className="w-full h-56 flex-shrink-0">
                                    <img
                                        src={d.img}
                                        alt={d.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-2xl font-bold text-white mb-4">{d.name}</h2>
                                    <p className="text-gray-300 text-sm leading-relaxed flex-grow">
                                        {d.info}
                                    </p>
                                    <button onClick={""} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 mt-4">
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

const data = [
    {
        name: "Kidney",
        img: "./images/cardImages/kidney x100 H&E 75.jpg",
        info: "Without your kidney, your body would be filled with waste. Give our kidneys some appreciation and let's look at what makes it up under the microscope!",
    },
    {
        name: "Lung",
        img: "./images/cardImages/kidney x100 H&E 76.jpg",
        info: "Lungs are important organ that helps with gaseous exchange. Have you ever wonder how does it looks like under microscope? Click here!",
    },
    {
        name: "Liver",
        img: "./images/cardImages/kidney x100 H&E 77.jpg",
        info: "Liver is one of the largest organ in the body and helps to detoxifies chemicals and metabolizes drugs. Click here to find out more about liver!",
    },
    {
        name: "Testes",
        img: "./images/cardImages/kidney x100 H&E 78.jpg",
        info: "Other than the ovaries, testes is the other organ that plays a part in reproduction. Take a look at which structures play a major role in sperm development!",
    },
    {
        name: "Small Intestine",
        img: "./images/cardImages/kidney x100 H&E 79.jpg",
        info: "Small intestine helps with digestion and allows nutrients to take place. Click here to find more about the different structures of the small intestine!",
    }
];

export default Home;