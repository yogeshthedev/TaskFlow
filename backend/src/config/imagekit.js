import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile(file, filename) {
  const response = await imagekit.upload({
    file: file, //required
    fileName: filename, //required
    folder: "Taskflow",
  });
  return response;
}
