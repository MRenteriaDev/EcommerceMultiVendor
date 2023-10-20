import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";
import { PaginationResponse } from "../models/pagination";
import { store } from "../store/configStore";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (import.meta.env.DEV) await sleep();

    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginationResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;

    switch (status) {
      case 400:
        if (data.errors) {
          const modalStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }
    console.log("caught by interceptors");
    return Promise.reject(error.response);
  }
);

const request = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
  list: (params: URLSearchParams) => request.get("product", params),
  details: (id: number) => request.get(`product/${id}`),
  fetchFilters: () => request.get("product/filters"),
};

const TestError = {
  get400Error: () => request.get("buggy/bad-request"),
  get401Error: () => request.get("buggy/unauthorized"),
  get404Error: () => request.get("buggy/not-found"),
  get500Error: () => request.get("buggy/server-error"),
  getValidationError: () => request.get("buggy/validation-error"),
};

const Categories = {
  get: () => request.get("categories"),
};

const Basket = {
  get: () => request.get("basket"),
  addItem: (productId: number, quantity = 1) =>
    request.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity: number) =>
    request.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const Account = {
  login: (values: any) => request.post("account/login", values),
  register: (values: any) => request.post("account/register", values),
  currentUser: () => request.get("account/currentUser"),
  fecthAddress: () => request.get("account/savedAddress"),
};

const Orders = {
  list: () => request.get("order"),
  fetch: (id: number) => request.get(`order/${id}`),
  create: (values: any) => request.post("order", values),
};

const Payments = {
  createPaymentIntent: () => request.post("payments", {}),
};

const agent = {
  Catalog,
  TestError,
  Basket,
  Account,
  Orders,
  Payments,
  Categories,
};

export default agent;
