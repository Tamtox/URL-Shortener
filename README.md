## /api
 - OpenAPI UI

## POST /url-shortener/shorten :
    - Description: This endpoint is used to shorten the URL.
    - Request:
    ```json
    {
        "url": "https://www.google.com",
        "alias": "google", // optional
        "validUntil": "2021-12-31T23:59:59" // optional
    }
    ```
    - Response:
    ```json
    {
        "id": 1,
        "short_url": "short.url-1f0383",
        "original_url": "https://www.google.com/",
        "usage_count": "3",
        "ips": [
            "::ffff:127.0.0.1",
            "::1",
            "::ffff:127.0.0.1"
        ],
        "created_at": "2025-01-12T10:04:22.904Z",
        "valid_until": null
    }
    ```

## GET /url-shortener/:shortUrl :
    - Description : Redirects to the original URL
    - Response - 302 Found:
    ```json
    {
        "url": "https://www.google.com"
    }
    ```

## GET /url-shortener/info/:shortUrl :
    - Description : Retrieves the information of the shortened URL
    - Response:
    ```json
    {
        "id": 1,
        "short_url": "short.url-1f0383",
        "original_url": "https://www.google.com/",
        "usage_count": "3",
        "ips": [
            "::ffff:127.0.0.1",
            "::1",
            "::ffff:127.0.0.1"
        ],
        "created_at": "2025-01-12T10:04:22.904Z",
        "valid_until": null
    }
    ```

## DELETE /url-shortener/:shortUrl :
    - Description: Deletes the shortened URL
    - Response:
    Status: 202 Accepted
    ```json
    {
        "message": "URL deleted successfully"
    }
    ```

## GET /url-shortener/analytics/:shortUrl :
    - Description: Retrieves the analytics of the shortened URL
    - Response:
    ```json
    {
         "id": 1,
        "short_url": "short.url-1f0383",
        "original_url": "https://www.google.com/",
        "usage_count": "3",
        "ips": [
            "::ffff:127.0.0.1",
            "::1",
            "::ffff:127.0.0.1"
        ],
        "created_at": "2025-01-12T10:04:22.904Z",
        "valid_until": null,
    }
    ```

## GET /url-shortener?queries :
    - Description: Retrieves the list of shortened URLs
    - Response:
    ```json
    [
        {
            "id": 1,
            "short_url": "short.url-1f0383",
            "original_url": "https://www.google.com/",
            "usage_count": "3",
            "ips": [
                "::ffff:127.0.0.1",
                "::1",
                "::ffff:127.0.0.1"
            ],
            "created_at": "2025-01-12T10:04:22.904Z",
            "valid_until": null
        }
    ]
    ```