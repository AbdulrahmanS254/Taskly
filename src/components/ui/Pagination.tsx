import { IconChevronLeft, IconChevronRight } from './icons';

interface PaginationProps {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    itemName?: string;
    onPageChange: (newPage: number) => void;
}

const paginationArrowBtn =
    'size-8 flex items-center justify-center border border-surface-low rounded-sm text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:bg-transparent disabled:cursor-not-allowed transition cursor-pointer';

export function Pagination({
    currentPage,
    totalCount,
    pageSize,
    itemName = 'item',
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-surface-low pt-4">
            <p className="text-xs font-medium text-slate-500">
                Showing {pageSize} of {totalCount} {itemName}
                {totalCount !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={paginationArrowBtn}
                >
                    <IconChevronLeft />
                </button>

                {Array.from({ length: totalPages }).map(
                    (_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`size-8 flex items-center justify-center border border-surface-low rounded-sm text-xs font-bold transition cursor-pointer ${
                                    currentPage === pageNum
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    }
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={paginationArrowBtn}
                >
                    <IconChevronRight />
                </button>
            </div>
        </div>
    );
}
