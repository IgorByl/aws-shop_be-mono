import * as dotenv from "dotenv";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const PRODUCTS_URL = 'products';
let productsStore;

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", (request, responce) => {
  console.log("BFF original url: ", request.originalUrl);
  console.log("BFF method: ", request.method);
  console.log("BFF body: ", request.body);

  const recipient = request.originalUrl.split("/")[1];
  console.log("BFF recipient: ", recipient);

  const recipientUrl = process.env[recipient];
  console.log("BFF recipientUrl: ", recipientUrl);

  if (recipient === PRODUCTS_URL && productsStore && productsStore.length) {
    responce.status(200).json(productsStore);
  }

  if (recipientUrl) {
    const axiosConfig = {
      method: request.method,
      url: `${recipientUrl}${request.originalUrl}`,
      ...(Object.keys(request.body || {}).length > 0 && { data: request.body }),
    };
    console.log("BFF axiosConfig: ", axiosConfig);

    axios(axiosConfig).then(res => {
        console.log("BFF response from recipient: ", res.data);

        if (recipient === PRODUCTS_URL) {
          productsStore = [...res.data];
          setTimeout(() => {
            productsStore = [];
          }, 120000);
        }

        responce.json(res.data);
    }).catch(error => {
        console.log("BFF error from recipient: ", JSON.stringify(error));

        if (error.responce) {
            const {status, data} = error.responce;
            responce.status(status).json(data);
        } else {
            responce.status(500).json({error: error.message});
        }
    });
  } else {
    responce.status(502).json({error: 'Cannot process request'});
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
