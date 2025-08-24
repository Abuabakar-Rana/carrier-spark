import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Shield, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'user'
  });
  const { toast } = useToast();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: `${newUser.username.toLowerCase().replace(/\s+/g, '')}@carrier-data.com`,
        password: newUser.password,
        user_metadata: {
          username: newUser.username
        },
        email_confirm: true
      });

      if (authError) {
        toast({
          title: "Error Creating User",
          description: authError.message,
          variant: "destructive"
        });
        return;
      }

      // Create profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          username: newUser.username,
          full_name: newUser.fullName,
          role: newUser.role
        });

      if (profileError) {
        toast({
          title: "Error Creating Profile",
          description: profileError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "User Created Successfully",
        description: `${newUser.username} has been added to the system.`,
      });

      // Reset form
      setNewUser({
        username: '',
        password: '',
        fullName: '',
        role: 'user'
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the user.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser(prev => ({ ...prev, password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage users and system settings
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">--</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">--</p>
                </div>
                <Shield className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Status</p>
                  <p className="text-2xl font-bold text-green-400">Active</p>
                </div>
                <div className="h-8 w-8 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-white rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create User Form */}
        <Card className="glass-effect shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <span>Create New User</span>
            </CardTitle>
            <CardDescription>
              Add a new user to the carrier data system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                    required
                    disabled={isCreating}
                    className="glass-effect"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter full name"
                    disabled={isCreating}
                    className="glass-effect"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="glass-effect">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="password"
                      type="text"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                      required
                      disabled={isCreating}
                      className="glass-effect flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePassword}
                      disabled={isCreating}
                      className="glass-effect"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewUser({ username: '', password: '', fullName: '', role: 'user' })}
                  disabled={isCreating}
                  className="glass-effect"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !newUser.username || !newUser.password}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  {isCreating ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;