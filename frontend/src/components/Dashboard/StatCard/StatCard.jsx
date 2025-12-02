import React from "react";

export default function StatCard({
    title,
    value,
    backgroundImage,
    className = "",
}) {
    const isNumber = typeof value === "number";

    const cardStyle = backgroundImage
        ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          }
        : {};

    return (
        <div
            className={`w-[223px] h-[110px] bg-[#1A202C] border border-gray-700 rounded-lg p-4 flex flex-col [box-shadow:0_0_7px_#a0e1fd] relative  transition-transform duration-200 ease-in-out hover:scale-105 ${className}`.trim()}
            style={cardStyle}
        >
            <div className="relative z-10 flex flex-col flex-grow">
                <h3 className="text-[14px] text-white font-bold text-center">
                    {title}
                </h3>
                <div className="flex-grow flex items-center">
                    {/* {isNumber ? ( */}
                    <p className="w-full text-center text-[34px] font-extrabold text-white">
                        {value}
                    </p>
                    {/* ) : (
                        <div className="text-left">
                            <p className="text-[15px] text-white">{value.accountName}</p>
                            <p className="text-[12px] text-white">{value.playerTag}</p>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}
