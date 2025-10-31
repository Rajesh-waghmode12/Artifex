import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpLoopExample {
    public static void main(String[] args) {

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:3000/home"))
                .GET()
                .build();

        for (int i = 1; i <= 10000; i++) {
            try {
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                System.out.println("Request #" + i + " - Status: " + response.statusCode() + "message :" + response
                        .body());
                // Print response body only for first few iterations to avoid flooding console
                if (i <= 3) {
                    System.out.println(response.body());
                }
            } catch (IOException | InterruptedException e) {
                System.out.println("Error on request #" + i + ": " + e.getMessage());
            }
        }

        System.out.println("✅ Completed 1000 requests.");
    }
}
