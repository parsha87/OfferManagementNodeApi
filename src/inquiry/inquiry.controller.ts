import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UploadedFile,
  ParseIntPipe,

} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response, Request } from 'express';
import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Inquiry routes')
@Controller('api/Inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) { }

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )

  async saveInquiry(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const formData = req.body;
      const model = JSON.parse(formData.model);
      const inquiryId = await this.inquiryService.saveInquiry(model);

      for (const file of files) {
        await this.inquiryService.saveAttachmentRecord({
          inquiryId,
          originalFileName: file.originalname,
          uniqueFileName: file.filename,
        });
      }

      return res.status(200).json({ message: 'Inquiry saved successfully.' });
    } catch (error) {
      throw new HttpException(
        { message: 'Error', detail: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllInquiries(@Res() res: Response) {
    try {
      const data = await this.inquiryService.getAllInquiries();
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to fetch inquiries', error: error.message });
    }
  }


  @Get(':id')
  async getInquiryById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const inquiry = await this.inquiryService.getInquiryById(id);
      if (!inquiry) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Inquiry not found' });
      }
      return res.status(HttpStatus.OK).json(inquiry);
    } catch (error) {
      console.error('Error fetching inquiry:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving inquiry',
        error: error.message,
      });
    }
  }


  @Put()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateInquiry(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const formData = req.body;
      const model = JSON.parse(formData.model);

      for (const file of files) {
        await this.inquiryService.saveAttachmentRecord({
          inquiryId: model.inquiryId,
          originalFileName: file.originalname,
          uniqueFileName: file.filename,
        });
      }

      await this.inquiryService.updateInquiry(model);
      return res.status(200).json({ message: 'Inquiry updated successfully.' });
    } catch (error) {
      throw new HttpException(
        { message: 'Error', detail: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:id')
  async deleteInquiry(@Param('id') id: number, @Res() res: Response) {
    await this.inquiryService.deleteInquiry(id);
    return res.json({ message: 'Inquiry deleted successfully.' });
  }

  @Get('getFileById/:id')
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    const file = await this.inquiryService.getAttachmentById(id);
    if (!file) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const filePath = join(process.cwd(), 'uploads', file.uniqueFileName);
    if (!fs.existsSync(filePath)) throw new HttpException('File not found.', 404);

    res.download(filePath, file.originalFileName);
  }

  @Delete('deleteFile/:id')
  async deleteFile(@Param('id') id: number, @Res() res: Response) {
    const result = await this.inquiryService.deleteAttachmentById(id);
    if (!result) throw new HttpException('File not found.', 404);

    return res.json({ message: 'File deleted successfully.' });
  }


  @Post('downloadPdf')
  @UseInterceptors(AnyFilesInterceptor())
  async downloadPdf(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const form = req.body;
      const modelJson = form['model'];
      const model = JSON.parse(modelJson);

      const templatePath = path.join(process.cwd(), 'samplePdf', 'samplePdf copy.html');
      const htmlTemplate = await fs.promises.readFile(templatePath, 'utf8');

      const technicalTableHtml = this.buildTechnicalDetailsHtml(model.technicaldetailsmappings);

      const imagePath = path.join(process.cwd(), 'samplePdf', 'offerImage.jpg');
      const imageBuffer = await fs.promises.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const logoImg = `data:image/jpeg;base64,${base64Image}`;

      let htmlBody = htmlTemplate
        .replace('#offerImage#', logoImg)
        .replace('#TotalPackage#', model.totalPackage || '')
        .replace('#enquiryNo#', model.enquiryNo || '')
        .replace('#rfqNo#', model.customerRfqno || '')
        .replace('#taxes#', "18% GST Extra")
        .replace('#stdPaymentTerms#', model.stdPaymentTerms || '')
        .replace('#deliveryTime#', moment(model.offerDueDate).format('DD/MMM/YYYY'))
        .replace('#date#', moment().format('DD/MMM/YYYY'))
        .replace('#customerName#', model.customerName || '')
        .replace('#custAddress#', model.custAddress || '')
        .replace('#cpName#', `${model.salutation || ''} ${model.cpfirstName || ''} ${model.cplastName || ''}`)
        .replace('#enquiryDate#', moment(model.enquiryDate).format('DD/MMM/YYYY'))
        .replace('{{technicalDetails}}', technicalTableHtml)
        .replace('#shipTo#', model.custAddress || '')
        .replace('#stdIncoTerms#', model.stdIncoTerms || '');

      const imageMap = {
        '#marathon#': await this.embedImage('marathon.png'),
        '#weg#': await this.embedImage('weg.png'),
        '#cemp#': await this.embedImage('cemp.png'),
        '#bharatbijlee#': await this.embedImage('bharatbijlee.jpg'),
        '#wolong#': await this.embedImage('wolong.png'),
        '#offerImage#': await this.embedImage('offerImage.jpg'),
        '#wolongatb#': await this.embedImage('wolongatb.png'),
        '#brookcromton#': await this.embedImage('brookcromton.png'),
        '#General_Electric_logo#': await this.embedImage('General_Electric_logo.svg.png'),
        '#kirloskar#': await this.embedImage('kirloskar.jpg'),
        '#hindustanelectric#': await this.embedImage('hindustanelectric.jpeg'),
        '#schorch#': await this.embedImage('schorch.jpeg'),
      };


      for (const [placeholder, base64Src] of Object.entries(imageMap)) {
        htmlBody = htmlBody.replace(new RegExp(this.escapeRegex(placeholder), 'g'), base64Src);
      }


      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(htmlBody, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '30px', bottom: '30px', left: '30px', right: '30px' },
      });

      await browser.close();

      const fileName = `Compliance_Certificate_${moment().format('MMDDYYYY_HHmmss')}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.end(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error while generating PDF' });
      }
    }
  }

  async embedImage(fileName: string): Promise<string> {
    const ext = path.extname(fileName).substring(1); // 'jpg', 'png'
    const filePath = path.join(process.cwd(), 'samplePdf', fileName);
    const buffer = await fs.promises.readFile(filePath);
    return `data:image/${ext};base64,${buffer.toString('base64')}`;
  }
  escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // private buildTechnicalDetailsHtml(details: any[]): string {
  //   if (!details || details.length === 0) return '';

  //   // 🔃 Group by brand
  //   const brandGroups: { [brand: string]: any[] } = {};
  //   for (const item of details) {
  //     const brand = item.brand || 'Others';
  //     if (!brandGroups[brand]) {
  //       brandGroups[brand] = [];
  //     }
  //     brandGroups[brand].push(item);
  //   }

  //   let finalHtml = '';

  //   for (const [brand, items] of Object.entries(brandGroups)) {
  //     // 🧾 Brand Header
  //     finalHtml += `<h3 style="margin-top: 30px; font-family: Arial;">Brand: ${brand}</h3>`;

  //     // 📦 Summary Table (narration, price, quantity, total)
  //     const narrationRows = items.map((item) => `
  //     <div style='display: flex; border-top: 1px solid #ddd;'>
  //       <div style='width: 300px; padding: 8px;'>${item.narration}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.amount}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.quantity}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.totalAmount || (item.amount * item.quantity)}</div>
  //     </div>
  //   `).join('');

  //     finalHtml += `
  //     <div style='min-width: 1000px; font-family: Arial, sans-serif;'>
  //       <div style='display: flex; font-weight: bold; background-color: #f0f0f0;'>
  //         <div style='width: 300px; padding: 8px;'>Narration</div>
  //         <div style='width: 100px; padding: 6px;'>Unit Price (INR)</div>
  //         <div style='width: 100px; padding: 6px;'>Quantity</div>
  //         <div style='width: 100px; padding: 6px;'>Total Amount (INR)</div>
  //       </div>
  //       ${narrationRows}
  //     </div>
  //   `;

  //     // ⚙️ Technical Parameters Table (motorType, kW, etc.)
  //     const techRows = items.map((item, index) => `
  //     <div style='display: flex; border-top: 1px solid #ddd;'>
  //       <div style='width: 100px; padding: 6px;'>${item.motorType}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.kw}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.hp}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.phase}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.pole}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.startType}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.frameSize}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.dop}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.insulationClass}</div>
  //       <div style='width: 100px; padding: 6px;'>${item.quantity}</div>
  //     </div>
  //   `).join('');

  //     finalHtml += `
  //     <div style='min-width: 1000px; font-family: Arial, sans-serif; margin-top: 20px;'>
  //       <div style='display: flex; font-weight: bold; background-color: #f0f0f0;'>
  //         <div style='width: 100px; padding: 6px;'>Motor Type</div>
  //         <div style='width: 100px; padding: 6px;'>KW</div>
  //         <div style='width: 100px; padding: 6px;'>HP</div>
  //         <div style='width: 100px; padding: 6px;'>Phase</div>
  //         <div style='width: 100px; padding: 6px;'>Pole</div>
  //         <div style='width: 100px; padding: 6px;'>Start Type</div>
  //         <div style='width: 100px; padding: 6px;'>Frame Size</div>
  //         <div style='width: 100px; padding: 6px;'>DOP</div>
  //         <div style='width: 100px; padding: 6px;'>Insulation Class</div>
  //         <div style='width: 100px; padding: 6px;'>Quantity</div>
  //       </div>
  //       ${techRows}
  //     </div>
  //   `;
  //   }
  //   return finalHtml;
  // }

  private buildTechnicalDetailsHtml(details: any[]): string {
    if (!details || details.length === 0) return '';

    const brandGroups: { [brand: string]: any[] } = {};
    for (const item of details) {
      const brand = item.brand || 'Others';
      if (!brandGroups[brand]) {
        brandGroups[brand] = [];
      }
      brandGroups[brand].push(item);
    }

    let finalHtml = '';

    for (const [brand, items] of Object.entries(brandGroups)) {
      finalHtml += `
      <h3 style="font-family: Arial; margin-bottom: 10px; border-bottom: 2px solid #555; padding-bottom: 5px; color: #1a1a1a;">
        Brand: ${brand}
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px; margin-bottom: 30px;">
        <thead>
<tr style="background-color:#ffffff; color: black; font-weight: bold; border: 1px solid #ccc;">
            <th style="padding: 10px; border: 1px solid #ccc;">Motor Type</th>
            <th style="padding: 10px; border: 1px solid #ccc;">KW</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Pole</th>             
            <th style="padding: 10px; border: 1px solid #ccc;">Frame Size</th>
            <th style="padding: 10px; border: 1px solid #ccc;">EFF</th>           
            <th style="padding: 10px; border: 1px solid #ccc;">VOLT</th>
            <th style="padding: 10px; border: 1px solid #ccc;">FREQ</th>            
            <th style="padding: 10px; border: 1px solid #ccc;">Product</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Unit Price</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Quantity</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Total</th>
          </tr>
        </thead>
        <tbody>
    `;

      let totalSum = 0;
      items.forEach((item, i) => {
        const total = item.totalAmount || (item.amount * item.quantity) || 0;
        totalSum += total;

        finalHtml += `
        <tr style="background-color: ${i % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
          <td style="border: 1px solid #ccc; padding: 8px;">${item.motorType || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.kw || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.pole || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.frameSize || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.efficiency || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.voltage || ''}</td>         
          <td style="border: 1px solid #ccc; padding: 8px;">${item.frequency || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${item.narration || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${item.amount || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${item.quantity || ''}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${total.toFixed(2)}</td>
        </tr>
      `;
      });

      finalHtml += `
        <tr style="background-color: #ffffff; font-weight: bold;">
          <td colspan="3" style="border: 1px solid #ccc; padding: 10px; text-align: right;">Total for ${brand}</td>
          <td style="border: 1px solid #ccc; padding: 10px; text-align: right;">${totalSum.toFixed(2)}</td>
          <td colspan="9" style="border: 1px solid #ccc;"></td>
        </tr>
      </tbody>
    </table>
    `;
    }

    return finalHtml;
  }



}
