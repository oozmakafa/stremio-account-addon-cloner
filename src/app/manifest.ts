import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Stremio Account Addon Cloner",
        short_name: "Stremio Addon Cloner",
        description: "Stremio Account Addon Cloner PWA",
        start_url: "/",
        display: "standalone",
        background_color: "#5528D8",
        theme_color: "#5528D8",
        "icons": [
            {
                "src": "/logo-72.png",
                "sizes": "72x72",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/logo-96.png",
                "sizes": "96x96",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/logo-128.png",
                "sizes": "128x128",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/logo-144.png",
                "sizes": "144x144",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/logo-152.png",
                "sizes": "152x152",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/logo-192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/logo-384.png",
                "sizes": "384x384",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/logo-512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any"
            }
        ]
    };
}
