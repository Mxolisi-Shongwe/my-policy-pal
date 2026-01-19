import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Policy, Investment, Alert } from '@/types/financial';

export function exportToPDF(
  policies: Policy[],
  investments: Investment[],
  alerts: Alert[],
  userEmail: string
) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('FinAssist - Financial Report', 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Account: ${userEmail}`, 14, 34);
  
  let yPos = 45;

  // Policies Section
  if (policies.length > 0) {
    doc.setFontSize(14);
    doc.text('Insurance Policies', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Policy', 'Provider', 'Type', 'Premium', 'Coverage', 'Expiry']],
      body: policies.map(p => [
        p.name,
        p.provider,
        p.type,
        `R${p.premium}`,
        `R${p.coverage.toLocaleString()}`,
        new Date(p.expiryDate).toLocaleDateString()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [245, 193, 66] }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Investments Section
  if (investments.length > 0) {
    doc.setFontSize(14);
    doc.text('Investments', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Investment', 'Provider', 'Type', 'Value', 'Return %']],
      body: investments.map(i => [
        i.name,
        i.provider,
        i.type,
        `R${i.currentValue.toLocaleString()}`,
        `${i.returnPercentage}%`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [245, 193, 66] }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Alerts Section
  if (alerts.length > 0 && yPos < 250) {
    doc.setFontSize(14);
    doc.text('Active Alerts', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Alert', 'Priority', 'Due Date']],
      body: alerts.slice(0, 10).map(a => [
        a.title,
        a.priority.toUpperCase(),
        new Date(a.dueDate).toLocaleDateString()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [245, 193, 66] }
    });
  }

  // Summary
  const totalCoverage = policies.reduce((sum, p) => sum + p.coverage, 0);
  const totalInvestments = investments.reduce((sum, i) => sum + i.currentValue, 0);
  
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Summary', 14, 20);
  doc.setFontSize(12);
  doc.text(`Total Insurance Coverage: R${totalCoverage.toLocaleString()}`, 14, 35);
  doc.text(`Total Investment Value: R${totalInvestments.toLocaleString()}`, 14, 45);
  doc.text(`Active Policies: ${policies.length}`, 14, 55);
  doc.text(`Active Investments: ${investments.length}`, 14, 65);
  doc.text(`Pending Alerts: ${alerts.length}`, 14, 75);

  doc.save(`FinAssist-Report-${new Date().toISOString().split('T')[0]}.pdf`);
}
