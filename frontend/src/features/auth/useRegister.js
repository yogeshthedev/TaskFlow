import { useMutation } from "@tanstack/react-query";
import { registerUser } from "./authApi";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      navigate("/tasks");
    },

    onError: (error) => {
      console.error(error);
    },
  });
};