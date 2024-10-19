import React from "react";
import ProgressBar from "./ProgressBar";
import { EcoRating } from "../App";
// interface EcoRating {
//   Material: number;
//   "Energy Efficiency": number;
//   Transportation: number;
//   "End-of-Life Management": number;
//   "Overall Eco-Friendliness Rating": number;
// }
interface EcoRatingProps {
  ecoRating: EcoRating;
}
const DisplayEcoRating = ({ ecoRating }: EcoRatingProps) => {
  return (
    <div>
      <div className="">
        <strong>Material: </strong> {ecoRating?.Material!}
      </div>
      <ProgressBar progress={ecoRating?.Material!} />
      <div>
        <strong>Energy Efficiency</strong> {ecoRating?.["Energy Efficiency"]!}
      </div>
      <ProgressBar progress={ecoRating?.["Energy Efficiency"]!} />
      <div>
        <strong>Transportation:</strong> {ecoRating?.Transportation!}{" "}
      </div>
      <ProgressBar progress={ecoRating?.Transportation!} />
      <div>
        <strong>End-of-Life Management:</strong>{" "}
        {ecoRating?.["End-of-Life Management"]!}{" "}
      </div>
      <ProgressBar progress={ecoRating?.["End-of-Life Management"]!} />
      <div>
        <strong>Overall Eco-Friendliness Rating: </strong>{" "}
        {ecoRating?.["Overall Eco-Friendliness Rating"]!}
      </div>
      <ProgressBar progress={ecoRating?.["Overall Eco-Friendliness Rating"]!} />
    </div>
  );
};

export default DisplayEcoRating;
