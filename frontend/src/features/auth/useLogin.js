import { useMutation } from "@tanstack/react-query";
import { loginUser } from "./authApi";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: () => {
      navigate("/");
    },

    onError: (error) => {
      console.error(error);
    },
  });
};