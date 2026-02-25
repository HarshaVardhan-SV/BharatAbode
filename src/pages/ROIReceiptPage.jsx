import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { Layout } from '../components/Layout';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';

const GST_RATE = 0.18;

export default function ROIReceiptPage() {
  const { user } = useAuth();
  const { savedIdeas, propertyForm } = useAppData();

  if (!savedIdeas.length) {
    return (
      <Layout>
        <EmptyState
          title="No ideas selected"
          description="Save ideas first to generate your billing and ROI receipt."
          action={
            <Link to="/recommendations" className="rounded-xl bg-brand-600 px-4 py-2 text-white">
              Go to Recommendations
            </Link>
          }
        />
      </Layout>
    );
  }

  const subtotal = savedIdeas.reduce((sum, item) => sum + Number(item.estimatedCost || 0), 0);
  const gst = subtotal * GST_RATE;
  const totalPayable = subtotal + gst;
  const cumulativeROI = savedIdeas.reduce((sum, item) => sum + Number(item.valueIncrease || 0), 0);
  const avgROI = cumulativeROI / savedIdeas.length;
  const projectedValueGain = subtotal * (avgROI / 100);
  const projectedNetBenefit = projectedValueGain - gst;

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 50;

    const line = (text, size = 11, x = 40) => {
      doc.setFontSize(size);
      doc.text(String(text), x, y);
      y += size + 8;
    };

    line('BharatAbode - Billing & ROI Receipt', 16);
    y += 6;
    line(`Date: ${new Date().toLocaleDateString('en-IN')}`);
    line(`Customer: ${user?.name || 'N/A'} (${user?.email || 'N/A'})`);
    line(`Location: ${propertyForm?.city || user?.city || 'N/A'}, ${propertyForm?.state || 'N/A'}`);

    y += 10;
    line('Selected Ideas:', 13);

    savedIdeas.forEach((idea, index) => {
      const content = `${index + 1}. ${idea.title} | ROI ${idea.valueIncrease}% | ${idea.timeRequired} | Rs. ${Number(
        idea.estimatedCost
      ).toLocaleString('en-IN')}`;

      if (y > 760) {
        doc.addPage();
        y = 50;
      }

      line(content, 10);
    });

    y += 10;
    if (y > 740) {
      doc.addPage();
      y = 50;
    }

    line(`Subtotal: Rs. ${subtotal.toLocaleString('en-IN')}`, 12);
    line(`GST (18%): Rs. ${gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 12);
    line(`Total Payable: Rs. ${totalPayable.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 12);
    line(`Average ROI: ${avgROI.toFixed(1)}%`, 12);
    line(`Projected Value Gain: Rs. ${projectedValueGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 12);
    line(`Projected Net Benefit: Rs. ${projectedNetBenefit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 12);

    doc.save(`bharatabode-roi-receipt-${Date.now()}.pdf`);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Billing & ROI Receipt</h1>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPdf}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Download PDF Receipt
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
            >
              Print
            </button>
          </div>
        </div>

        <section className="glass rounded-2xl p-6">
          <div className="mb-5 grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Customer</p>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm">{user?.email}</p>
              <p className="text-sm">{user?.city}</p>
            </div>
            <div className="md:text-right">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Receipt Date</p>
              <p className="font-semibold">{new Date().toLocaleDateString('en-IN')}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Type: Improvement Planning Summary</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300/40 dark:border-slate-700/40">
                  <th className="px-3 py-2 text-left">Idea</th>
                  <th className="px-3 py-2 text-left">Timeline</th>
                  <th className="px-3 py-2 text-right">ROI %</th>
                  <th className="px-3 py-2 text-right">Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                {savedIdeas.map((idea) => (
                  <tr key={idea.id} className="border-b border-slate-200/60 dark:border-slate-800/60">
                    <td className="px-3 py-2">{idea.title}</td>
                    <td className="px-3 py-2">{idea.timeRequired}</td>
                    <td className="px-3 py-2 text-right">{idea.valueIncrease}%</td>
                    <td className="px-3 py-2 text-right">Rs. {Number(idea.estimatedCost).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-white/40 p-4 dark:bg-slate-800/40">
              <h2 className="mb-3 text-lg font-semibold">Property Context</h2>
              <p className="text-sm">City: {propertyForm?.city || user?.city || 'N/A'}</p>
              <p className="text-sm">State: {propertyForm?.state || 'N/A'}</p>
              <p className="text-sm">Property Type: {propertyForm?.propertyType || 'N/A'}</p>
              <p className="text-sm">Planning Budget: {propertyForm?.budget ? `Rs. ${Number(propertyForm.budget).toLocaleString('en-IN')}` : 'N/A'}</p>
            </div>

            <div className="rounded-xl bg-white/40 p-4 dark:bg-slate-800/40">
              <h2 className="mb-3 text-lg font-semibold">Billing Summary</h2>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString('en-IN')}</span></p>
                <p className="flex justify-between"><span>GST (18%)</span><span>Rs. {gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></p>
                <p className="flex justify-between font-semibold"><span>Total Payable</span><span>Rs. {totalPayable.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></p>
                <p className="mt-3 flex justify-between"><span>Average ROI</span><span>{avgROI.toFixed(1)}%</span></p>
                <p className="flex justify-between"><span>Projected Value Gain</span><span>Rs. {projectedValueGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></p>
                <p className="flex justify-between font-semibold text-brand-600"><span>Projected Net Benefit</span><span>Rs. {projectedNetBenefit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
