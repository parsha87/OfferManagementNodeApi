import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

// @Injectable()
// export class ExcelService {

export async function exportDataToExcel(data: any[], headers: string[], fileName: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    // Add headers
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFA500' } // Orange color
        };
      });
   
    data.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    // Auto fit columns
    worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      });

    const buffer = await workbook.xlsx.writeBuffer();
    return { buffer, fileName };
  }

  export async function convertExcelToJson(filePath) {
    const workbook = new ExcelJS.Workbook();
    const jsonData = [];
    try {
      await workbook.xlsx.readFile(filePath);

      // Assuming there's only one sheet in the Excel file
      const worksheet = workbook.worksheets[0];

      // Iterate over all rows (including empty rows)
      worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // Skip header row
              let rowData = {};
              row.eachCell((cell, colNumber) => {
                  const headerCell = worksheet.getRow(1).getCell(colNumber);
                  const headerText = headerCell.value;
                  rowData[`${headerText}`] =  cell.value
              });
              jsonData.push(rowData);
          }
      });

      return jsonData;
  } catch (error) {
      console.error('Error reading Excel file:', error.message);
      return null;
  }
}
// }