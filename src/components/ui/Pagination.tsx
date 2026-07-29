import { IconChevronLeft, IconChevronRightLarge } from './icons';

interface PaginationProps {
    page: number;
    totalPages: number;
    totalCount: number;
    itemName?: string;
    onPageChange: (newPage: number) => void;
}

export function Pagination({ page, totalPages, totalCount, itemName = 'item', onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-surface-low pt-4">
            <p className="text-xs font-medium text-slate-500">
                Showing {totalCount} active {itemName}{totalCount !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="size-8 flex items-center justify-center border border-surface-low rounded-sm text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:bg-transparent disabled:cursor-not-allowed transition cursor-pointer"
                >
                    <IconChevronLeft />
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`size-8 flex items-center justify-center border border-surface-low rounded-sm text-xs font-bold transition cursor-pointer ${
                                page === pageNum
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="size-8 flex items-center justify-center border border-surface-low rounded-sm text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:bg-transparent disabled:cursor-not-allowed transition cursor-pointer"
                >
                    <IconChevronRightLarge />
                </button>
            </div>
        </div>
    );
}