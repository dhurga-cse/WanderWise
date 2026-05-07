package com.wanderwise.helpers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Component
public class UnsplashHelper {

    @Value("${unsplash.access.key}")
    private String accessKey;

    private final RestTemplate http = new RestTemplate();

    public String getImage(String destination) {
        try {
            String url = "https://api.unsplash.com/search/photos?query="
                    + destination + "&per_page=1&orientation=landscape";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Client-ID " + accessKey);
            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = http.exchange(url, HttpMethod.GET, request, Map.class);

            if (response.getBody() != null) {
                List results = (List) response.getBody().get("results");
                if (results != null && !results.isEmpty()) {
                    Map urls = (Map) ((Map) results.get(0)).get("urls");
                    return (String) urls.get("regular");
                }
            }
        } catch (Exception e) {
            System.out.println("Unsplash error: " + e.getMessage());
        }
        return "";
    }
}
