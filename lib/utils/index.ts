"use server";

import axios from "axios";
import PDFParser from "pdf2json";
// import PDFServicesSdk, { ExtractElementType, ExtractPDFJob, ExtractPDFParams, ExtractPDFResult, MimeType, PDFServices, ServicePrincipalCredentials } from '@adobe/pdfservices-node-sdk';
import { Readable } from "stream";

export const fetchFileBuffer = async (url: string): Promise<{buffer: Buffer, contentType: any}> => {
  const response = await axios.get(url, {
    responseType: "arraybuffer", // important for binary files
  });

  const buffer = Buffer.from(response.data);
  const contentType = response.headers["content-type"];

  return {buffer, contentType}
};

export const pdfJsonTest = async (buffer: Buffer):Promise<any> => {
  const pdfParser = new PDFParser(null, true);
  // return new Promise((resolve, reject) => {

  //   pdfParser.on('pdfParser_dataError', err => reject(err.parserError));
  //   pdfParser.on('pdfParser_dataReady', (data) => {
  //     const text = data?.Pages?.map(page =>
  //       page.Texts.map(t =>
  //         decodeURIComponent(t.R.map(r => r.T).join(""))
  //       ).join(" ")
  //     ).join("\n");
  //     resolve(text || "");
  //   });

  //   pdfParser.parseBuffer(buffer);
  // });
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', err => reject(err.parserError));

    pdfParser.on('pdfParser_dataReady', () => {
      const text = pdfParser.getRawTextContent();
      // Optionally normalize newlines or page breaks if needed
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}                                    