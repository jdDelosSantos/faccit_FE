import axios from "axios";

export default axios.create({
  //   baseURL: "http://localhost/cms_BE/cms-be/public/api/",
  baseURL: "http://localhost/faccit_BE/faccit_BE/public/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
