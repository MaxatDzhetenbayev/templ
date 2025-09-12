import { axiosApi } from "./axios-client";

export const customInstance = <T>(config: any): Promise<T> => {
  return axiosApi(config).then(({ data }) => data);
};

export default customInstance;
