
import { Cloud, CloudRain, Sun, Cloudy, CloudLightning, CloudMoonRain, Moon, ThermometerSun, ThermometerSnowflake } from "lucide-react";

interface WeatherIconProps {
  condition: string;
  size?: number;
}

const WeatherIcon = ({ condition, size = 48 }: WeatherIconProps) => {
  const conditionLower = condition.toLowerCase();
  
  const getIcon = () => {
    if (conditionLower.includes("sunny") || conditionLower.includes("clear day")) {
      return <Sun size={size} className="text-yellow-300" />;
    } else if (conditionLower.includes("clear") && conditionLower.includes("night")) {
      return <Moon size={size} className="text-blue-200" />;
    } else if (conditionLower.includes("partly cloudy") || conditionLower.includes("overcast")) {
      return <Cloudy size={size} className="text-gray-300" />;
    } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return <CloudRain size={size} className="text-blue-300" />;
    } else if (conditionLower.includes("snow") || conditionLower.includes("blizzard")) {
      return <ThermometerSnowflake size={size} className="text-blue-200" />;
    } else if (conditionLower.includes("storm") || conditionLower.includes("thunder")) {
      return <CloudLightning size={size} className="text-purple-300" />;
    } else if (conditionLower.includes("mist") || conditionLower.includes("fog")) {
      return <Cloud size={size} className="text-gray-400" />;
    } else if (conditionLower.includes("hot")) {
      return <ThermometerSun size={size} className="text-red-400" />;
    } else if (conditionLower.includes("night") && conditionLower.includes("rain")) {
      return <CloudMoonRain size={size} className="text-blue-300" />;
    } else {
      return <Cloudy size={size} className="text-gray-300" />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getIcon()}
    </div>
  );
};

export default WeatherIcon;
