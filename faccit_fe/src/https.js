import axios from "axios";

export default axios.create({
  //   baseURL: "http://localhost/cms_BE/cms-be/public/api/",
  baseURL: "http://localhost:8012/faccit_BE/faccit_BE/public/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
