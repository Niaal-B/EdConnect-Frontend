import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Avatar, AvatarFallback, AvatarImage 
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronDown, MoreHorizontal, Eye, Ban, Trash, UserCheck, UserX 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { updateUserStatus } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface UsersTableProps {
  users: any[];
  userType: 'student' | 'mentor';
  onViewProfile: (user: any) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users: initialUsers,
  userType,
  onViewProfile,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<any[]>(initialUsers);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: any | null;
    action: string;
  }>({ open: false, user: null, action: '' });

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users.map((user) => user.id) : []);
  };

  const handleSelectUser = (id: number, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, id] : prev.filter((userId) => userId !== id)
    );
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    toast.success(`${action} ${selectedUsers.length} users successfully`);
    setSelectedUsers([]);
  };

  const handleSingleAction = async (action: string, user: any) => {
    try {
      if (action === 'Activated' || action === 'Deactivated') {
        const newStatus = action === 'Activated';
        await updateUserStatus(user.id, newStatus);
        setUsers((users) =>
          users.map((u) =>
            u.id === user.id ? { ...u, is_active: newStatus } : u
          )
        );
        toast.success(
          `${user.name} ${newStatus ? 'activated' : 'deactivated'} successfully`
        );
      } else if (action === 'Verified') {
        toast.success(`Verified ${user.name} successfully`);
      } else if (action === 'Deleted') {
        toast.success(`Deleted ${user.name} successfully`);
      }
    } catch (error) {
      toast.error(`Failed to update ${user.name}'s status`);
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 p-3 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">{selectedUsers.length}</span> users
            selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('Activated')}
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('Deactivated')}
            >
              <UserX className="h-4 w-4 mr-1" />
              Deactivate
            </Button>
            {userType === 'mentor' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('Verified')}
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Verify
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleBulkAction('Deleted')}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Registration Date</TableHead>
              <TableHead>Status</TableHead>
              {userType === 'mentor' && (
                <TableHead className="hidden lg:table-cell">Verification</TableHead>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userType === 'mentor' ? 8 : 7} className="text-center py-8 text-gray-500">
                  No users found matching your search criteria
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.mentor_profile?.profile_picture} />
                        <AvatarFallback>
                          <img 
                            src="https://imgs.search.brave.com/fci8pKvmNekH-4msfUmmrfQP0y9ixcyHhIPqRPSF8DM/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9jZG40/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvdXNlci1idXNp/bmVzc21hbi1wcm9m/aWxlLW1hbi1zeW1i/b2xzLzEwMC8yOS0x/VXNlci0xMjgucG5n" 
                            alt="fallback"
                            className="h-full w-full object-cover rounded-full"
                          />
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500 md:hidden">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(user.created_at).toISOString().split('T')[0]}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  {userType === 'mentor' && (
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={user?.mentor_profile?.is_verified ? 'success' : 'outline'}>
                        {user?.mentor_profile?.is_verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewProfile(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              user,
                              action: user.is_active ? 'Deactivated' : 'Activated',
                            })
                          }
                        >
                          {user.is_active ? (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
              
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              user,
                              action: 'Deleted',
                            })
                          }
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will <strong>{confirmDialog.action.toLowerCase()}</strong> user{' '}
              <strong>{confirmDialog.user?.name}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleSingleAction(confirmDialog.action, confirmDialog.user);
                setConfirmDialog({ open: false, user: null, action: '' });
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{users.length}</span> out of{' '}
          <span className="font-medium">{users.length}</span> users
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
