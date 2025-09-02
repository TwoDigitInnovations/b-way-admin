import axios from "axios";
import Cookies from "js-cookie";
// const ConstantsUrl = "http://localhost:8000";
const ConstantsUrl = process.env.NODE_ENV === 'development'? "http://localhost:8000" : 'https://api.b-way.net';

// const ConstantsUrl = "https://api.b-way.net";

function Api(method, url, data, router, params) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || Cookies.get("token") || "";
    }
    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: { Authorization: `Bearer ${token}` },
      params,
    }).then(
      (res) => {
        resolve(res.data);
      },
      (err) => {
        console.log(err);
        if (err.response) {
          if (err?.response?.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("userDetail");
              router?.push("/");
            }
            console.error("Unauthorized access - redirecting to login");
          }
          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

function ApiFormData(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }
    console.log(token);
    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: {
        Authorization: `jwt ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(
      (res) => {
        resolve(res.data);
      },
      (err) => {
        console.log(err);
        if (err.response) {
          if (err?.response?.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("userDetail");
              router?.push("/");
            }
          }
          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

function ApiGetPdf(url, data, router, params) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }

    axios({
      method: "GET",
      url: ConstantsUrl + url,
      data,
      headers: { Authorization: `jwt ${token}` },
      params,
      responseType: "blob",
    }).then(
      (res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);
        // window.open(fileURL); // open file in browser do not touch if not to open pdf immediatly

        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "file.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve(res.data);
      },
      (err) => {
        console.log("Error:", err);
        if (err.response) {
          const status = err.response.status;
          const message = err.response?.data?.message || "";

          if (
            (status === 401 || status === 403) &&
            typeof window !== "undefined"
          ) {
            if (
              message.toLowerCase().includes("jwt expired") ||
              message.toLowerCase().includes("unauthorized")
            ) {
              localStorage.removeItem("token");
              localStorage.removeItem("userDetail");
              router?.push("/signIn");
            }
          }
          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

const pdfDownload = async (fileName, data) => {
  return new Promise(function (resolve, reject) {
    pdfMake.vfs = {};
    pdfMake.jszip = jszip;
    pdfMake.DynamicContent = {
      content: {
        widths: "100%",
      },
    };
    pdfMake.fonts = {
      Roboto: {
        normal:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
        bold:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
        italics:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
        bolditalics:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
      },
    };

    pdfmake.createPdf(data).download(fileName);
    pdfmake.createPdf(data).getDataUrl((blob) => {
      console.log("pdf======>", blob);

      resolve(blob);
    });
  });
};

const replaceUrl =(url)=>{
 return url?.replace('https://surfacegallery.s3.eu-north-1.amazonaws.com','https://d1wm56uk2e4fvb.cloudfront.net')
}

export { Api, pdfDownload, ApiFormData,replaceUrl, ApiGetPdf };
