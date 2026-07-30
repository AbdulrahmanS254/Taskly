import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProjectMembers, type ProjectMember } from '../services/membersService';
import { getInitials } from '../../../utils/helpers';

// MemberSkeleton component for loading state
function MemberSkeleton() {
    return (
        <div className="bg-white flex items-center justify-between p-4 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="flex flex-col gap-2">
                    <div className="w-32 h-5 bg-slate-200 rounded" />
                    <div className="w-40 h-4 bg-slate-200 rounded" />
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="w-16 h-6 bg-slate-200 rounded" />
                <div className="w-6 h-6 bg-slate-200 rounded" />
            </div>
        </div>
    );
}

export default function ProjectMembersPage() {
    // Extract projectId 
    const { projectId } = useParams<{ projectId: string }>();

    // State management for data, loading states, and error handling
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Guard clause to prevent API calls if the URL is malformed
        if (!projectId) {
            setError('Project ID is missing from the URL.');
            setLoading(false);
            return;
        }

        const fetchMembers = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const data = await getProjectMembers(projectId);
                setMembers(data);
            } catch (err: any) {
                setError(err?.message || 'Failed to load project members. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [projectId]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-end justify-between mb-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500">
                        <span>PROJECTS</span>
                        <span className="text-slate-300">/</span>
                        <span>PROJECT NAME</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-blue-800">MEMBERS</span>
                    </div>
                    <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
                        Project Members
                    </h1>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-700 to-blue-600 text-white font-bold text-sm rounded shadow-lg hover:shadow-xl transition-shadow">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Invite Member</span>
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col gap-3">
                    {[...Array(5)].map((_, i) => (
                        <MemberSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex flex-col items-center justify-center py-24 px-8">
                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">Something went wrong</h2>
                    <p className="text-slate-600 text-center max-w-md mb-6 leading-relaxed">
                        We're having trouble retrieving your project members right now. Please try again in a moment.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded shadow-md hover:shadow-lg transition-shadow"
                    >
                        Retry Connection
                    </button>
                </div>
            )}

            {/* Members List */}
            {!loading && !error && members.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-blue-50/30 border-b border-slate-200 px-8 py-5 grid grid-cols-[2fr_1fr_auto] gap-8">
                        <div className="text-xs font-bold tracking-widest text-slate-600 uppercase">MEMBER</div>
                        <div className="text-xs font-bold tracking-widest text-slate-600 uppercase">ROLE</div>
                        <div className="text-xs font-bold tracking-widest text-slate-600 uppercase text-right">ACTIONS</div>
                    </div>

                    {/* Members List Items */}
                    <div className="divide-y divide-slate-100">
                        {members.map((member) => (
                            <div 
                                key={member.member_id} 
                                className="px-8 py-6 grid grid-cols-[2fr_1fr_auto] gap-8 items-center hover:bg-slate-50 transition-colors"
                            >
                                {/* Member Info */}
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
                                        style={{
                                            backgroundColor: member.role === 'owner' ? '#dae2ff' : member.role === 'admin' ? '#82f9be' : member.role === 'member' ? '#82f9be' : '#d6e3ff',
                                            color: member.role === 'owner' ? '#003d9b' : member.role === 'admin' ? '#002113' : member.role === 'member' ? '#002113' : '#091c35'
                                        }}
                                    >
                                        {getInitials(member.metadata?.name)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">
                                            {member.metadata?.name}
                                        </div>
                                        <div className="text-slate-600 text-xs">
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Role Badge */}
                                <div>
                                    <span 
                                        className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-bold tracking-wide uppercase"
                                        style={{
                                            backgroundColor: member.role === 'owner' ? '#0052cc' : member.role === 'admin' ? '#cdddff' : member.role === 'member' ? '#d7e2ff' : '#e8edff',
                                            color: member.role === 'owner' ? '#ffffff' : member.role === 'admin' ? '#51617e' : '#434654'
                                        }}
                                    >
                                        {member.role}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end">
                                    {member.role !== 'owner' && (
                                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                            <svg className="w-1 h-4" fill="currentColor" viewBox="0 0 4 16">
                                                <circle cx="2" cy="2" r="2" />
                                                <circle cx="2" cy="8" r="2" />
                                                <circle cx="2" cy="14" r="2" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && members.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                    No members found for this project.
                </div>
            )}
        </div>
    );
}