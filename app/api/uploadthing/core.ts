import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // no auth for now
      return { userId: "demo-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(" Upload complete for user:", metadata.userId);
      console.log(" File URL:", file.url);

      // must return something
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
