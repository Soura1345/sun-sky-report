import { useState, useEffect } from "react";
import { Search, MapPin, Wind, Eye, Droplets, Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import WeatherIcon from "./WeatherIcon";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    uv: number;
    air_quality: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      "us-epa-index": number;
      "gb-defra-index": number;
    };
  };
}

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const API_KEY = "a46db09ecb5441c184152323253005";
  const BASE_URL = "https://api.weatherapi.com/v1/current.json";

  const fetchWeatherData = async (city: string = "London") => {
    try {
      setIsSearching(true);
      console.log(`Fetching weather data for: ${city}`);
      
      const response = await fetch(
        `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`
      );
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Weather data not found: ${response.status}`);
      }
      
      const data = await response.json();
      setWeatherData(data);
      console.log("Weather data loaded:", data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "CORS Error",
        description: "This API requires a backend server due to CORS restrictions. Please use a CORS proxy or implement a backend.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const getBackgroundClass = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
      return "from-yellow-400 via-orange-500 to-pink-500";
    } else if (conditionLower.includes("cloud")) {
      return "from-gray-400 via-gray-500 to-gray-600";
    } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return "from-blue-400 via-blue-500 to-blue-600";
    } else if (conditionLower.includes("snow")) {
      return "from-blue-200 via-blue-300 to-blue-400";
    } else if (conditionLower.includes("storm") || conditionLower.includes("thunder")) {
      return "from-gray-700 via-gray-800 to-gray-900";
    } else {
      return "from-blue-400 via-purple-500 to-pink-500";
    }
  };

  const getAirQualityLevel = (index: number) => {
    if (index <= 1) return { text: "Good", color: "text-green-600" };
    if (index <= 2) return { text: "Moderate", color: "text-yellow-600" };
    if (index <= 3) return { text: "Unhealthy for Sensitive", color: "text-orange-600" };
    if (index <= 4) return { text: "Unhealthy", color: "text-red-600" };
    if (index <= 5) return { text: "Very Unhealthy", color: "text-purple-600" };
    return { text: "Hazardous", color: "text-red-800" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4">
          <CardContent className="text-center">
            <h2 className="text-xl font-bold mb-4">Weather App Demo</h2>
            <p className="text-gray-600 mb-4">
              Due to CORS restrictions, this API requires a backend server to work properly. 
              Here's what the weather app would look like with sample data:
            </p>
            <Button 
              onClick={() => {
                // Show demo data instead
                setWeatherData({
                  location: {
                    name: "London",
                    region: "City of London, Greater London",
                    country: "United Kingdom",
                    localtime: new Date().toISOString().slice(0, 16).replace('T', ' ')
                  },
                  current: {
                    temp_c: 22,
                    temp_f: 72,
                    condition: {
                      text: "Partly cloudy",
                      icon: "",
                      code: 1003
                    },
                    wind_kph: 15,
                    wind_dir: "W",
                    humidity: 65,
                    feelslike_c: 24,
                    feelslike_f: 75,
                    vis_km: 10,
                    uv: 5,
                    air_quality: {
                      co: 233.4,
                      no2: 15.5,
                      o3: 89.3,
                      so2: 4.6,
                      pm2_5: 8.1,
                      pm10: 12.3,
                      "us-epa-index": 1,
                      "gb-defra-index": 2
                    }
                  }
                });
              }}
              className="mt-4"
            >
              Show Demo Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const backgroundClass = getBackgroundClass(weatherData.current.condition.text);
  const airQuality = getAirQualityLevel(weatherData.current.air_quality["us-epa-index"]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/70"
            />
            <Button 
              type="submit" 
              disabled={isSearching}
              className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Main Weather Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="h-5 w-5" />
                <h1 className="text-2xl font-bold">
                  {weatherData.location.name}, {weatherData.location.country}
                </h1>
              </div>
              <p className="text-white/70">{weatherData.location.region}</p>
              <p className="text-white/70 text-sm">
                {new Date(weatherData.location.localtime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <WeatherIcon 
                  condition={weatherData.current.condition.text}
                  size={80}
                />
                <div>
                  <div className="text-6xl font-light mb-2">
                    {Math.round(weatherData.current.temp_c)}°
                  </div>
                  <p className="text-white/80 text-sm">
                    Feels like {Math.round(weatherData.current.feelslike_c)}°
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/90 capitalize">
                {weatherData.current.condition.text}
              </p>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <Wind className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm text-white/70">Wind</p>
                <p className="font-semibold">{weatherData.current.wind_kph} km/h</p>
                <p className="text-xs text-white/60">{weatherData.current.wind_dir}</p>
              </div>
              
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <Droplets className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm text-white/70">Humidity</p>
                <p className="font-semibold">{weatherData.current.humidity}%</p>
              </div>
              
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <Eye className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm text-white/70">Visibility</p>
                <p className="font-semibold">{weatherData.current.vis_km} km</p>
              </div>
              
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <Thermometer className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm text-white/70">UV Index</p>
                <p className="font-semibold">{weatherData.current.uv}</p>
              </div>
            </div>

            {/* Air Quality */}
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3">Air Quality</h3>
              <div className="flex items-center justify-between mb-2">
                <span>Overall Quality:</span>
                <span className={`font-semibold ${airQuality.color.replace('text-', 'text-white ')}`}>
                  {airQuality.text}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white/70">PM2.5</p>
                  <p className="font-semibold">{weatherData.current.air_quality.pm2_5.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-white/70">PM10</p>
                  <p className="font-semibold">{weatherData.current.air_quality.pm10.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-white/70">O3</p>
                  <p className="font-semibold">{weatherData.current.air_quality.o3.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherApp;
