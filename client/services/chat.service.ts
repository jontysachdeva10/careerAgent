import { apiRequest } from "./base.service";

export const sendMessage = async (message: string) => {
  return apiRequest("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
};

export const clearConversation = async () => {
  return apiRequest("/delete/chat", {
    method: "DELETE",
  });
};
