package com.wanderwise.dto;

import java.util.List;

public class RouteDto {

    public static class RouteRequest {
        private String source;
        private String destination;
        private Coords sourceCoords;
        private Coords destCoords;

        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }
        public Coords getSourceCoords() { return sourceCoords; }
        public void setSourceCoords(Coords sourceCoords) { this.sourceCoords = sourceCoords; }
        public Coords getDestCoords() { return destCoords; }
        public void setDestCoords(Coords destCoords) { this.destCoords = destCoords; }
    }

    public static class Coords {
        private Double lat;
        private Double lng;

        public Coords() {}
        public Coords(Double lat, Double lng) { this.lat = lat; this.lng = lng; }
        public Double getLat() { return lat; }
        public void setLat(Double lat) { this.lat = lat; }
        public Double getLng() { return lng; }
        public void setLng(Double lng) { this.lng = lng; }
    }

    public static class RouteResponse {
        private List<double[]> coordinates;
        private String distance;
        private Integer duration;
        private LocationInfo source;
        private LocationInfo destination;

        public RouteResponse() {}
        public RouteResponse(List<double[]> coordinates, String distance, Integer duration,
                             LocationInfo source, LocationInfo destination) {
            this.coordinates = coordinates;
            this.distance = distance;
            this.duration = duration;
            this.source = source;
            this.destination = destination;
        }

        public List<double[]> getCoordinates() { return coordinates; }
        public void setCoordinates(List<double[]> coordinates) { this.coordinates = coordinates; }
        public String getDistance() { return distance; }
        public void setDistance(String distance) { this.distance = distance; }
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
        public LocationInfo getSource() { return source; }
        public void setSource(LocationInfo source) { this.source = source; }
        public LocationInfo getDestination() { return destination; }
        public void setDestination(LocationInfo destination) { this.destination = destination; }
    }

    public static class LocationInfo {
        private String name;
        private Coords coords;

        public LocationInfo() {}
        public LocationInfo(String name, Coords coords) { this.name = name; this.coords = coords; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Coords getCoords() { return coords; }
        public void setCoords(Coords coords) { this.coords = coords; }
    }
}
