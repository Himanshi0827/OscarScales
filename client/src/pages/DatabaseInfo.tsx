import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Table, Users, MessageSquare, Settings } from "lucide-react";
import { Product, ContactMessage } from "@shared/schema";

const DatabaseInfo = () => {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: contacts = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/contacts"],
  });

  return (
    <>
      <div className="bg-gradient-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Database Information</h1>
          <p className="text-lg">PostgreSQL Database Structure & Statistics</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Weighing scales across all categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
              <p className="text-xs text-muted-foreground">
                Customer inquiries received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Type</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">PostgreSQL</div>
              <p className="text-xs text-muted-foreground">
                Production-ready database
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Database Schema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Products Table</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Badge variant="outline">id (Primary Key)</Badge>
                  <Badge variant="outline">name</Badge>
                  <Badge variant="outline">description</Badge>
                  <Badge variant="outline">price</Badge>
                  <Badge variant="outline">image</Badge>
                  <Badge variant="outline">category</Badge>
                  <Badge variant="outline">featured</Badge>
                  <Badge variant="outline">bestseller</Badge>
                  <Badge variant="outline">new_arrival</Badge>
                  <Badge variant="outline">accuracy</Badge>
                  <Badge variant="outline">power_supply</Badge>
                  <Badge variant="outline">display</Badge>
                  <Badge variant="outline">material</Badge>
                  <Badge variant="outline">warranty</Badge>
                  <Badge variant="outline">certification</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contact Messages Table</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Badge variant="outline">id (Primary Key)</Badge>
                  <Badge variant="outline">name</Badge>
                  <Badge variant="outline">email</Badge>
                  <Badge variant="outline">phone</Badge>
                  <Badge variant="outline">subject</Badge>
                  <Badge variant="outline">message</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Users Table</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Badge variant="outline">id (Primary Key)</Badge>
                  <Badge variant="outline">username</Badge>
                  <Badge variant="outline">password</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Persistent Storage</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-backup</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ACID Compliance</span>
                  <Badge className="bg-green-100 text-green-800">Supported</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Scalability</span>
                  <Badge className="bg-blue-100 text-blue-800">High</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Concurrent Users</span>
                  <Badge className="bg-blue-100 text-blue-800">Multiple</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Data Persistence</h4>
                <p className="text-sm text-muted-foreground">
                  All data is automatically saved to PostgreSQL database. Products, contact messages, 
                  and user data persist between server restarts. No manual data initialization required.
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Admin Operations</h4>
                <p className="text-sm text-muted-foreground">
                  Use the Admin Panel to add, edit, and delete products. All changes are immediately 
                  saved to the database and reflected across the website.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DatabaseInfo;