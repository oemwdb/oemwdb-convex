import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
    pathPrefix: "/api/media/",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const url = new URL(request.url);
        // Path should be after /api/media/
        // e.g. /api/media/bmw/m3/good_pic.jpg -> path = bmw/m3/good_pic.jpg
        const fullPath = url.pathname.slice("/api/media/".length);

        if (!fullPath) {
            return new Response("No path provided", { status: 400 });
        }

        // Look up the storageId in our virtual file system
        const fileRecord = await ctx.runQuery(internal.storageInternal.getFileByPath, { path: fullPath });

        if (!fileRecord) {
            return new Response("File not found", { status: 404 });
        }

        // Fetch the file from Convex Storage
        const blob = await ctx.storage.get(fileRecord.storageId);
        if (!blob) {
            return new Response("Storage file missing", { status: 404 });
        }

        // Return the file with its content type
        return new Response(blob, {
            headers: {
                "Content-Type": fileRecord.contentType ?? "application/octet-stream",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    }),
});

export default http;
