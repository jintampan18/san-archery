// src/setupProxy.js  
import { createProxyMiddleware } from 'http-proxy-middleware';  
  
export default function (app) {  
  app.use(  
    '/api',  
    createProxyMiddleware({  
      target: 'https://api.rajaongkir.com',  
      changeOrigin: true,  
      pathRewrite: {  
        '^/api': '', // Menghapus '/api' dari URL  
      },  
    })  
  );  
}  