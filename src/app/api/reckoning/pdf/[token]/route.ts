import { NextRequest, NextResponse } from 'next/server';
import { getReckoningByToken, setReckoningPdfUrl } from '@/lib/db';
import puppeteer from 'puppeteer';
import { generatePDFFilename } from '@/lib/pdf/filename';

// Get the base URL for rendering
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    // Fetch the reckoning to verify it exists and has a report
    const reckoning = await getReckoningByToken(token);

    if (!reckoning) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    if (!reckoning.report) {
      return NextResponse.json(
        { error: 'Report not yet generated' },
        { status: 400 }
      );
    }

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    try {
      const page = await browser.newPage();

      // Set viewport for consistent rendering
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 2, // Higher quality
      });

      // Navigate to the report page
      const baseUrl = getBaseUrl();
      const reportUrl = `${baseUrl}/reckoning/${token}?print=true`;

      await page.goto(reportUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Wait for content to render
      await page.waitForSelector('main', { timeout: 10000 });

      // Add print-specific styles
      await page.addStyleTag({
        content: `
          @media print {
            body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .no-print { display: none !important; }
          }
          /* Hide header download button in PDF */
          header button { display: none !important; }
        `,
      });

      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="width: 100%; font-size: 10px; color: #666; text-align: center; padding: 10px 0;">
            <span>Reckoning</span>
            <span style="margin: 0 10px;">|</span>
            <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `,
      });

      // Generate human-readable filename
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const report = reckoning.report as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const answers = reckoning.answers as any;
      const recipientName = report?.recipient?.name || answers?.name || 'Client';
      const generatedAt = report?.generated_at ? new Date(report.generated_at) : new Date();
      const filename = generatePDFFilename(recipientName, generatedAt);

      // Return the PDF
      return new NextResponse(Buffer.from(pdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'private, max-age=3600',
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
