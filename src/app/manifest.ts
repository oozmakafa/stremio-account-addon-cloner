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
        icons: [
            {
                src: "/logo.png",
                sizes: "1024x1024",
                type: "image/png",
            },
        ],
    };
}
