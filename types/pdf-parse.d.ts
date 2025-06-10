declare module 'pdf-parse';
declare module 'pdf-parse' {
  export interface PDFParseResult {
    numpages: number;
    info: {
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
      Creator?: string;
      Producer?: string;
      CreationDate?: string;
      ModDate?: string;
    };
    text: string;
  }

  export default function pdfParse(buffer: Buffer): Promise<PDFParseResult>;
}