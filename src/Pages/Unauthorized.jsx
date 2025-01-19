import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeLowVision } from "@fortawesome/free-solid-svg-icons";

export const Unauthorized = () => {
    return (
        <div className="relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center opacity-40 z-10">
                <FontAwesomeIcon icon={faEyeLowVision} size="10x" />
            </div>
            <div className="relative z-20 mt-64 text-center">
                <h1 className="text-3xl font-bold text-white">Brak uprawnień</h1>
                <p className="mt-4 text-lg text-white">Nie masz odpowiednich uprawnień, aby zobaczyć tę stronę.</p>
            </div>
        </div>
    );
};
