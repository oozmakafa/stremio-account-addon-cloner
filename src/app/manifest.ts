import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Stremio Account Addon Cloner",
        short_name: "Addon Cloner",
        description: "Stremio Account Addon Cloner PWA",
        start_url: "/",
        display: "standalone",
        background_color: "#822d7dff",
        theme_color: "#000000",
        icons: [
            {
                src: "/logo.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/logo.png",
                sizes: "500x500",
                type: "image/png",
            },
        ],
    };
}
