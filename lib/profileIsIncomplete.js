import { useQuery } from "@tanstack/react-query";
import api from "./api";

const useProfileIsIncomplete = () => {
  const { data, isLoading, isError } = useQuery(["me"], () => api.get("/user"));
  if (isLoading || isError) return false;
  const { user } = data.data;
  return user.name === "null" || user.image === "null";
};

export default useProfileIsIncomplete;
