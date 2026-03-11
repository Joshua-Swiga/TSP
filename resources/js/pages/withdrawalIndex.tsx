import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem } from '@/types';
import { BadgeCheck, ChevronRight, Search, Filter, X } from 'lucide-react';

type Withdrawal = {
  id: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  fee: number;
  status: 'Pending' | 'Approved';
  statusRaw: 'pending' | 'complete';
  date: string;
  flagged: boolean;
  transaction_code?: string;
  comments?: string;
  method: string;
};

type Props = {
  withdrawals: Withdrawal[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  filters: {
    email: string;
    status: string;
    flagged: string | null;
    min_amount: string | null;
    max_amount: string | null;
    start_date: string | null;
    end_date: string | null;
  };
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Withdrawals', href: '/withdrawals' },
];

export default function WithdrawalIndex({
  withdrawals = [],
  pagination = {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  },
  filters = {
    email: '',
    status: '',
    flagged: null,
    min_amount: null,
    max_amount: null,
    start_date: null,
    end_date: null,
  },
}: Props) {
  const [activeFilters, setActiveFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      setActiveFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const applyFilters = useCallback(() => {
    const queryParams: Record<string, any> = {};

    if (activeFilters.email) queryParams.email = activeFilters.email;
    if (activeFilters.status) queryParams.status = activeFilters.status;
    if (activeFilters.flagged !== null) queryParams.flagged = activeFilters.flagged;
    if (activeFilters.min_amount) queryParams.min_amount = activeFilters.min_amount;
    if (activeFilters.max_amount) queryParams.max_amount = activeFilters.max_amount;
    if (activeFilters.start_date) queryParams.start_date = activeFilters.start_date;
    if (activeFilters.end_date) queryParams.end_date = activeFilters.end_date;

    router.get(route('pay.withdrawals'), queryParams);
  }, [activeFilters]);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      email: '',
      status: '',
      flagged: null,
      min_amount: null,
      max_amount: null,
      start_date: null,
      end_date: null,
    });
    router.get(route('pay.withdrawals'));
  }, []);

  const hasActiveFilters =
    activeFilters.email ||
    activeFilters.status ||
    activeFilters.flagged !== null ||
    activeFilters.min_amount ||
    activeFilters.max_amount ||
    activeFilters.start_date ||
    activeFilters.end_date;

  const fmt = new Intl.NumberFormat();

  const goToPage = useCallback((page: number) => {
    const queryParams: Record<string, any> = { page };

    if (activeFilters.email) queryParams.email = activeFilters.email;
    if (activeFilters.status) queryParams.status = activeFilters.status;
    if (activeFilters.flagged !== null) queryParams.flagged = activeFilters.flagged;
    if (activeFilters.min_amount) queryParams.min_amount = activeFilters.min_amount;
    if (activeFilters.max_amount) queryParams.max_amount = activeFilters.max_amount;
    if (activeFilters.start_date) queryParams.start_date = activeFilters.start_date;
    if (activeFilters.end_date) queryParams.end_date = activeFilters.end_date;

    router.get(route('pay.withdrawals'), queryParams);
  }, [activeFilters]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Withdrawals" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight">Withdrawals</h1>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="#"><BadgeCheck className="h-4 w-4 mr-2" />New request</Link>
          </Button>
        </div>

        {/* Filters Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={activeFilters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Search by email"
                className="pl-9"
              />
            </div>
            <Button onClick={applyFilters} className="bg-primary text-primary-foreground">
              Search
            </Button>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                className="text-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="bg-muted p-6 rounded-lg border border-border space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={activeFilters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Flagged</label>
                  <select
                    value={activeFilters.flagged === null ? '' : String(activeFilters.flagged)}
                    onChange={(e) =>
                      handleFilterChange(
                        'flagged',
                        e.target.value === '' ? null : e.target.value === 'true'
                      )
                    }
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Flagged</option>
                    <option value="false">Not Flagged</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Min Amount</label>
                  <Input
                    type="number"
                    value={activeFilters.min_amount || ''}
                    onChange={(e) => handleFilterChange('min_amount', e.target.value)}
                    placeholder="0"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Max Amount</label>
                  <Input
                    type="number"
                    value={activeFilters.max_amount || ''}
                    onChange={(e) => handleFilterChange('max_amount', e.target.value)}
                    placeholder="999999"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <Input
                    type="date"
                    value={activeFilters.start_date || ''}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">End Date</label>
                  <Input
                    type="date"
                    value={activeFilters.end_date || ''}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={applyFilters} className="bg-primary text-primary-foreground">
                  Apply Filters
                </Button>
                <Button onClick={clearFilters} variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mt-6 text-sm text-muted-foreground">
          Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} withdrawals
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden lg:grid grid-cols-12 px-6 py-3 text-xs font-semibold text-muted-foreground border-b border-border">
            <div className="col-span-5">Applicant</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <ul className="divide-y divide-border">
            {withdrawals && withdrawals.length > 0 ? (
              withdrawals.map((w) => (
                <li key={w.id} className="group px-4 lg:px-6 py-4 hover:bg-muted/40 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-3">
                    <div className="col-span-5 min-w-0">
                      <div className="truncate text-sm font-semibold">{w.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{w.email}</div>
                      <div className="truncate text-[11px] text-muted-foreground mt-1">
                        {w.phone}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm font-bold">${fmt.format(w.amount)}</div>
                      <div className="text-xs text-muted-foreground">Fee: ${fmt.format(w.fee)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            w.statusRaw === 'complete'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {w.status}
                        </span>
                        {w.flagged && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Flagged
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <div className="text-right hidden lg:block">
                        <div className="text-xs text-muted-foreground">{w.date}</div>
                      </div>
                      <Button asChild size="sm" className="bg-primary text-primary-foreground shrink-0">
                        <Link href={route('pay.single-withdrawal-request', { id: w.id })}>
                          <span className="hidden lg:inline">View</span>
                          <ChevronRight className="h-4 w-4 lg:ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center text-muted-foreground">
                No withdrawals found matching your filters.
              </li>
            )}
          </ul>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {pagination.current_page} of {pagination.last_page}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => goToPage(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                variant="outline"
              >
                Previous
              </Button>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => goToPage(page)}
                  variant={page === pagination.current_page ? 'default' : 'outline'}
                  className={page === pagination.current_page ? 'bg-primary' : ''}
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={() => goToPage(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

