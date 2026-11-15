// Backward compatibility wrapper pointing to the native Fetch API client
import { apiService, mapId } from "./apiService";

export { apiService, mapId };
export const mockService = apiService;
export const initMockDatabase = () => {
  // Connected to live backend and MongoDB
};
export default apiService;
