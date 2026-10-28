import type { jsPDF as JsPDF } from 'jspdf';

export interface ReporteExportable {
  id: string;
  title: string;
  sheetName: string;
  columns: string[];
  rows: (string | number)[][];
}

function esColumnaTotalizable(columna: string): boolean {
  if (
    /^(id|identificador|c[oó]digo|venta|pago|pedido|cliente|producto|mesa|turno|folio|comprobante|serie|n[uú]mero)$/i.test(columna.trim())
    || /\b(id|identificador|c[oó]digo|promedio|por comensal|variaci[oó]n)\b/i.test(columna)
    || /^n[uú]mero\b/i.test(columna.trim())
  ) {
    return false;
  }
  return /\b(cantidad|comprobantes|operaciones|productos vendidos|unidades|personas|comensales|subtotal|igv|total|importe|monto|ingresos|egresos|diferencia|sistema|declarado|adelanto|costo|descuento|servicio|ventas actual|ventas anterior|registros)\b/i.test(columna);
}

function esImporte(columna: string): boolean {
  return /\b(subtotal|igv|total|importe|monto|ingresos|egresos|diferencia|sistema|declarado|adelanto|costo|descuento|servicio|ventas actual|ventas anterior)\b/i.test(columna);
}

function filaTotales(reporte: ReporteExportable): (string | number)[] {
  return reporte.columns.map((columna, index) => {
    if (index === 0) return 'TOTALES';
    if (!esColumnaTotalizable(columna)) return '';
    return reporte.rows.reduce((total, fila) => {
      const valor = fila[index];
      return typeof valor === 'number' && Number.isFinite(valor) ? total + valor : total;
    }, 0);
  });
}

function filaPdf(fila: (string | number)[], columnas: string[]): string[] {
  return fila.map((value, index) => {
    if (typeof value === 'number' && esImporte(columnas[index] ?? '')) {
      return `S/ ${value.toFixed(2)}`;
    }
    return String(value);
  });
}

function nombreArchivo(reporte: ReporteExportable, periodo: string, extension: string): string {
  const slug = reporte.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const rango = periodo.replaceAll('/', '-').replaceAll(' ', '');
  return `chifa-${slug}-${rango}.${extension}`;
}

export async function exportarReportesExcel(
  reportes: ReporteExportable[],
  periodo: string,
  filtros: string,
): Promise<void> {
  const { default: ExcelJS } = await import('exceljs');
  const libro = new ExcelJS.Workbook();
  libro.creator = 'Sistema Chifa Yemheng';
  libro.created = new Date();

  const resumen = libro.addWorksheet('Resumen');
  resumen.columns = [
    { header: 'Reporte', key: 'reporte', width: 34 },
    { header: 'Registros incluidos', key: 'registros', width: 22 },
    { header: 'Periodo', key: 'periodo', width: 26 },
    { header: 'Filtros aplicados', key: 'filtros', width: 54 },
  ];
  resumen.addRows(reportes.map((reporte) => ({
    reporte: reporte.title,
    registros: reporte.rows.length,
    periodo,
    filtros,
  })));
  resumen.addRow({
    reporte: 'TOTALES',
    registros: reportes.reduce((total, reporte) => total + reporte.rows.length, 0),
    periodo: '',
    filtros: '',
  });

  for (const reporte of reportes) {
    const hoja = libro.addWorksheet(reporte.sheetName);
    hoja.addRow(reporte.columns);
    for (const fila of reporte.rows) hoja.addRow(fila);
    hoja.addRow(filaTotales(reporte));
    hoja.views = [{ state: 'frozen', ySplit: 1 }];
    hoja.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: Math.max(1, reporte.rows.length + 1), column: reporte.columns.length },
    };
    hoja.columns = reporte.columns.map((header, index) => {
      const maxDataLength = reporte.rows.reduce(
        (max, row) => Math.max(max, String(row[index] ?? '').length),
        header.length,
      );
      return {
        width: Math.min(Math.max(maxDataLength + 2, 14), 34),
        style: /total|monto|subtotal|igv|diferencia|ingresos|egresos|inicial|sistema|declarado/i.test(header)
          ? { numFmt: '"S/ " #,##0.00;[Red]-"S/ " #,##0.00' }
          : undefined,
      };
    });
  }

  for (const hoja of libro.worksheets) {
    const encabezado = hoja.getRow(1);
    encabezado.height = 24;
    encabezado.eachCell((celda) => {
      celda.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA61E22' } };
      celda.alignment = { vertical: 'middle', wrapText: true };
    });
    hoja.eachRow({ includeEmpty: false }, (fila, rowNumber) => {
      if (rowNumber === hoja.rowCount) {
        fila.eachCell((celda) => {
          celda.font = { bold: true, color: { argb: 'FF7F1518' } };
          celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3E7DF' } };
          celda.border = { top: { style: 'thin', color: { argb: 'FFA61E22' } } };
        });
      } else if (rowNumber > 1 && rowNumber % 2 === 0) {
        fila.eachCell((celda) => {
          celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F5F2' } };
        });
      }
    });
  }

  const archivo = await libro.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([archivo], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }));
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo(reportes[0], periodo, 'xlsx');
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportarReportesPdf(
  reportes: ReporteExportable[],
  periodo: string,
  filtros: string,
): Promise<void> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const ancho = pdf.internal.pageSize.getWidth();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(116, 28, 27);
  pdf.text(reportes[0].title, 14, 18);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(85, 85, 85);
  pdf.text(`Chifa Yemheng · Periodo: ${periodo}`, 14, 25);
  pdf.text(`Generado: ${new Date().toLocaleString('es-PE')}`, ancho - 14, 25, { align: 'right' });
  pdf.setFontSize(8);
  pdf.text(`Filtros: ${filtros || 'Ninguno'}`, 14, 30, { maxWidth: ancho - 28 });

  let y = 38;
  for (const reporte of reportes) {
    if (y > pdf.internal.pageSize.getHeight() - 24) {
      pdf.addPage();
      y = 18;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(35, 35, 35);
    pdf.text(reporte.title, 14, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${reporte.rows.length} registros`, ancho - 14, y, { align: 'right' });

    autoTable(pdf, {
      startY: y + 3,
      head: [reporte.columns],
      body: [
        ...(reporte.rows.length > 0
          ? reporte.rows.map((row) => filaPdf(row, reporte.columns))
          : [reporte.columns.map((_, index) => index === 0 ? 'Sin registros para este periodo' : '')]),
        filaPdf(filaTotales(reporte), reporte.columns),
      ],
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      headStyles: { fillColor: [166, 30, 34], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 245, 242] },
      margin: { left: 14, right: 14, bottom: 14 },
      didParseCell: (data) => {
        if (data.section === 'body' && data.row.index === (reporte.rows.length || 1)) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [243, 231, 223];
          data.cell.styles.textColor = [127, 21, 24];
        }
      },
      didDrawPage: () => {
        const pageCount = pdf.getNumberOfPages();
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`Página ${pageCount}`, ancho - 14, pdf.internal.pageSize.getHeight() - 7, { align: 'right' });
      },
    });
    y = (pdf as JsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 12;
    y += 12;
  }

  pdf.save(nombreArchivo(reportes[0], periodo, 'pdf'));
}
