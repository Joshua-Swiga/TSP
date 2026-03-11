import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Download, History, PencilLine, User, ArrowLeft, Flag } from 'lucide-react';
import { useState } from 'react';

type WithdrawalRequest = {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  balance: number;
  requested: number;
  fee: number;
  status: string;
  flagged: boolean;
  comments: string | null;
  method: string;
  processed_by: string | null;
  date_created: string;
  date_updated: string;
  events: Array<{
    title: string;
    meta: string;
    color: 'emerald' | 'primary' | 'slate';
  }>;
};

type Props = {
  request: WithdrawalRequest;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Withdrawals', href: '/withdrawals' },
  { title: 'Detail', href: '' },
];

export default function SingleWithdrawalView({ request }: Props) {
  const [comments, setComments] = useState(request.comments || '');
  const [isFlagged, setIsFlagged] = useState(request.flagged);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const money = new Intl.NumberFormat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(route('pay.update-withdrawal', { id: request.id }), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify({
          comments: comments,
          flagged: isFlagged,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({ type: 'success', message: 'Withdrawal updated successfully' });
        setTimeout(() => {
          router.get(route('pay.withdrawals'));
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to update withdrawal' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An error occurred while updating' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFlag = async () => {
    try {
      const response = await fetch(route('pay.toggle-flag', { id: request.id }), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsFlagged(data.flagged);
        setFeedback({ type: 'success', message: data.flagged ? 'Marked as flagged' : 'Unflagged' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to update flag status' });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(route('pay.download-withdrawal-pdf', { id: request.id }), {
        method: 'GET',
        headers: {
          'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `withdrawal-${request.uuid}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setFeedback({ type: 'success', message: 'PDF downloaded successfully' });
      } else {
        const errorData = await response.text();
        console.error('PDF Download Error:', errorData);
        setFeedback({ type: 'error', message: `Failed to download PDF: ${response.status}` });
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setFeedback({ type: 'error', message: 'Error downloading PDF' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Withdrawal • ${request.uuid}`} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="px-2">
            <Link href={route('pay.withdrawals')}><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
          </Button>
          <h1 className="text-xl font-extrabold tracking-tight">Withdrawal Detail</h1>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold">{request.avatar}</div>
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-background" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{request.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{request.email}</div>
                    <div className="text-sm text-muted-foreground">{request.phone}</div>
                  </div>
                  <div className="px-5 py-2 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Available Balance</span>
                    <span className="text-lg font-bold">${money.format(request.balance)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Requested</div>
                  <div className="text-xl font-bold mt-1">${money.format(request.requested)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Processing Fee</div>
                  <div className="text-xl font-bold text-rose-600 mt-1">${money.format(request.fee)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-4 w-4 text-primary" />History Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {request.events.map((e, i) => (
                    <li key={i} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className={`h-2.5 w-2.5 rounded-full ${e.color === 'emerald' ? 'bg-emerald-500' : e.color === 'primary' ? 'bg-primary' : 'bg-slate-400'}`} />
                        {i !== request.events.length - 1 && <span className="h-full w-px bg-border" />}
                      </div>
                      <div className="pb-4">
                        <div className="text-sm font-semibold">{e.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{e.meta}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PencilLine className="h-4 w-4 text-primary" />Administrative Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Administrative Remarks</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      disabled={request.comments ? true : false}
                      placeholder="Enter transaction code and internal notes regarding this withdrawal process..."
                      rows={4}
                      className={`w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${request.comments ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || (request.comments ? true : false)}
                      className="w-full bg-primary text-primary-foreground"
                    >
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      {isSubmitting ? 'Updating...' : 'Complete Process'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />Applicant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{request.avatar}</div>
                  <div>
                    <div className="font-semibold">{request.name}</div>
                    <div className="text-muted-foreground text-xs">{request.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" />{request.date_updated}</div>
                <div>
                  <Badge variant="secondary" className="mr-2">KYC</Badge>
                  <Badge variant="secondary">MFA</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Flag className="h-4 w-4 text-primary" />Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs font-medium mb-2">Current Status</div>
                  <div
                    className={`px-3 py-2 rounded-full text-center text-sm font-semibold ${
                      request.status === 'complete'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {request.status === 'complete' ? 'Completed' : 'Pending'}
                  </div>
                </div>

                {request.processed_by && (
                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium text-foreground mb-1">Processed By</div>
                    {request.processed_by}
                  </div>
                )}

                {(request.status === 'complete' || request.comments) && (
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                )}

                <button
                  onClick={toggleFlag}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isFlagged
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="h-4 w-4 mr-2 inline" />
                  {isFlagged ? 'Unflag' : 'Flag for Review'}
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


