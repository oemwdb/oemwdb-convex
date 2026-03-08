import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, AlertTriangle } from "lucide-react";

const DevVehiclesTab = () => {
  const { data: vehicles, isLoading, error, isError } = { data: null as any, isLoading: false, error: null };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="structure">Data Structure</TabsTrigger>
        <TabsTrigger value="raw">Raw Data</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-0">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Data Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Convex</Badge>
                  <p className="text-xs text-muted-foreground">OEM Vehicles table</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Count</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{vehicles?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Vehicle entries</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isLoading ? (
                    <Badge variant="secondary">Loading</Badge>
                  ) : isError ? (
                    <Badge variant="destructive">Error</Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-600">Connected</Badge>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "Fetching data..." : isError ? "Connection failed" : "Live data"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {isError && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Error Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-destructive/10 p-4 rounded-md text-xs overflow-x-auto text-destructive">
                  <code>{error?.message || "Unknown error occurred"}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="structure" className="mt-0">
        <div className="space-y-6">
          {vehicles && vehicles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Data Structure (Sample)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Wheels</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.slice(0, 10).map((vehicle, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{vehicle.name}</TableCell>
                        <TableCell>{vehicle.brand}</TableCell>
                        <TableCell className="font-mono">{vehicle.wheels}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Data Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                <code>{`interface Vehicle {
  name: string;    // OEM Chassis Code
  brand: string;   // Brand Name or List of Brands
  wheels: number;  // Always 0 in current implementation
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="raw" className="mt-0">
        {vehicles && vehicles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sample Raw Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                <code>{JSON.stringify(vehicles[0], null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DevVehiclesTab;