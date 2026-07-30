import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProjectMembers, type ProjectMember } from '../services/membersService';
import { getInitials } from '../../../utils/helpers';

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

    // Temporary UI to test the data fetching logic
    if (loading) return <div className="p-8 text-slate-500">Loading members data...</div>;
    
    if (error) return <div className="p-8 text-red-500 font-medium">{error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Project Members (Raw Data)</h1>
            <p className="text-slate-600 mb-4">Count: {members.length}</p>
            <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(members, null, 2)}
            </pre>
        </div>
    );
}