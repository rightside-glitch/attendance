import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Export a React component or HTML element to PDF
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} filename - The name of the PDF file (without .pdf)
 */
export async function exportToPDF(element, filename) {
  if (!element) {
    alert('No content to export')
    return
  }

  try {
    // Convert element to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })

    // Get canvas dimensions
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const imgData = canvas.toDataURL('image/png')

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Add image to PDF
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= 297 // A4 height in mm

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297
    }

    // Save PDF
    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error('PDF export error:', error)
    alert('Error generating PDF: ' + error.message)
  }
}

/**
 * Generate a simple attendance report as PDF
 * @param {Array} attendanceData - Array of attendance records
 * @param {string} userName - Name of the user
 * @param {string} month - Month in YYYY-MM format
 */
export function generateAttendanceReport(attendanceData, userName, month) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Title
  pdf.setFontSize(16)
  pdf.text('Attendance Report', 105, 20, { align: 'center' })

  // Details
  pdf.setFontSize(11)
  pdf.text(`Employee: ${userName}`, 20, 40)
  pdf.text(`Period: ${month}`, 20, 50)
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60)

  // Stats
  const present = attendanceData.filter((a) => a.status === 'present').length
  const absent = attendanceData.filter((a) => a.status === 'absent').length
  const late = attendanceData.filter((a) => a.status === 'late').length
  const total = attendanceData.length
  const rate = ((present / total) * 100).toFixed(1)

  pdf.setFontSize(10)
  pdf.text(`Total Days: ${total}`, 20, 75)
  pdf.text(`Present: ${present}`, 20, 85)
  pdf.text(`Absent: ${absent}`, 20, 95)
  pdf.text(`Late: ${late}`, 20, 105)
  pdf.text(`Attendance Rate: ${rate}%`, 20, 115)

  // Table
  const headers = ['Date', 'Status']
  const rows = attendanceData.map((record) => [
    record.date || new Date(record.date).toLocaleDateString(),
    record.status.charAt(0).toUpperCase() + record.status.slice(1),
  ])

  pdf.autoTable({
    head: [headers],
    body: rows,
    startY: 130,
    margin: 20,
  })

  // Footer
  pdf.setFontSize(8)
  pdf.text('This is an auto-generated report from SAPT', 105, 280, { align: 'center' })

  pdf.save(`${userName}_Attendance_${month}.pdf`)
}

/**
 * Generate a simple performance report as PDF
 * @param {Object} performanceData - Performance metrics
 * @param {string} userName - Name of the user
 * @param {string} month - Month in YYYY-MM format
 */
export function generatePerformanceReport(performanceData, userName, month) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Title
  pdf.setFontSize(16)
  pdf.text('Performance Report', 105, 20, { align: 'center' })

  // Details
  pdf.setFontSize(11)
  pdf.text(`Employee: ${userName}`, 20, 40)
  pdf.text(`Period: ${month}`, 20, 50)
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60)

  // Metrics
  pdf.setFontSize(10)
  pdf.text(`Attendance Rate: ${performanceData.attendanceRate || 0}%`, 20, 75)
  pdf.text(`Tasks Completed: ${performanceData.tasksCompleted || 0}`, 20, 85)
  pdf.text(`Average Task Rating: ${(performanceData.averageTaskRating || 0).toFixed(1)}/5`, 20, 95)

  // Flags
  if (performanceData.flags && performanceData.flags.length > 0) {
    pdf.setTextColor(255, 0, 0)
    pdf.setFontSize(10)
    pdf.text('Alerts:', 20, 110)
    let y = 120
    performanceData.flags.forEach((flag) => {
      pdf.text(`• ${flag.replace(/_/g, ' ')}`, 25, y)
      y += 7
    })
    pdf.setTextColor(0, 0, 0)
  }

  // Footer
  pdf.setFontSize(8)
  pdf.text('This is an auto-generated report from SAPT', 105, 280, { align: 'center' })

  pdf.save(`${userName}_Performance_${month}.pdf`)
}
