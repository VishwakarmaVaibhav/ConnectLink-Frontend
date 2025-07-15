import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";
import imageCompression from "browser-image-compression"; // ⬅️ Add at the top


const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // File list
  const [imagePreviews, setImagePreviews] = useState([]); // Base64 previews
  const [projectLink, setProjectLink] = useState("");

  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create post");
    },
  });

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_IMAGES = 5;

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
  
    if (files.length + images.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }
  
    const newCompressedImages = [];
    const newPreviews = [];
  
    for (let file of files) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast("Compressing large image...");
  
        try {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });
  
          const base64 = await readFileAsDataURL(compressedFile);
          newCompressedImages.push(compressedFile);
          newPreviews.push(base64);
        } catch (err) {
          console.error("Compression failed:", err);
          toast.error("Failed to compress image");
        }
      } else {
        const base64 = await readFileAsDataURL(file);
        newCompressedImages.push(file);
        newPreviews.push(base64);
      }
    }
  
    setImages((prev) => [...prev, ...newCompressedImages]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };
  

  const handlePostCreation = async () => {
    try {
      let postData = { content, projectLink };

      if (images.length > 0) {
        const base64Images = await Promise.all(images.map(readFileAsDataURL));
        postData.images = base64Images;
      }

      createPost(postData);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setImages([]);
    setImagePreviews([]);
    setProjectLink("");
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 transition-colors p-4 rounded-lg resize-none min-h-[120px] focus:outline-none text-sm text-gray-800"
        />
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full rounded-lg object-contain max-h-[250px]"
              />
            </div>
          ))}
        </div>
      )}

      {/* Project Link */}
      <div className="mt-4">
        <input
          type="url"
          placeholder="Project link (optional)"
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none focus:border-blue-500 transition duration-200"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-6">
        <label className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700 transition duration-200">
          <Image size={20} className="mr-2" />
          <span className="text-sm">Add Photo(s)</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
        </label>

        <button
          onClick={handlePostCreation}
          disabled={isPending || !content.trim()}
          className="bg-blue-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-60"
        >
          {isPending ? (
            <Loader className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
