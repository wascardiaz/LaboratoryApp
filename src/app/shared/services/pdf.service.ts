import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  pdfMake: any;

  constructor() { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      // const myPdfFontsModule = await import('./../../assets/fonts/vfs_fonts.js');

      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
      // (<any>this.pdfMake).vfs = myPdfFontsModule.pdfMake.vfs;

      this.pdfMake.fonts = {
        Fontello: {
          normal: 'fontello.ttf',
          bold: 'fontello.ttf',
          italics: 'fontello.ttf',
          bolditalics: 'fontello.ttf'
        },
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf'
        },
        Icomoon: {
          normal: 'icomoon.ttf',
          bold: 'icomoon.ttf',
          italics: 'icomoon.ttf',
          bolditalics: 'icomoon.ttf'
        },
        Myicomoon: {
          normal: 'myicomoon.ttf',
          bold: 'myicomoon.ttf',
          italics: 'myicomoon.ttf',
          bolditalics: 'myicomoon.ttf'
        }
      };
    }
  }

  async generatePdf(action = 'open', documentDefinition: Object, filename: string = '') {

    await this.loadPdfMaker();

    if (action === 'download') {
      this.pdfMake.createPdf(documentDefinition).download(filename !== '' ? filename : 'file');
    } else if (action === 'print') {
      this.pdfMake.createPdf(documentDefinition).print();
    } else {
      this.pdfMake.createPdf(documentDefinition).open();
    }

    /* const def = { content: 'A sample PDF document generated using Angular and PDFMake' };
    this.pdfMake.createPdf(def).open(); */
  }
}
