import { User } from '../../types';
import { UserRole } from '../../types';

interface UserManagementProps {
    user: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
    return (
        <div>
            {/* ... other user info ... */}
            <span className={`badge ${user.role === UserRole.ADMIN ? 'badge-primary' : 'badge-secondary'}`}>
                {user.role}
            </span>
        </div>
    );
}; 