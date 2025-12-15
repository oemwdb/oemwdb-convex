import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Static brand data
const brandsData = [
  "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Porsche", "Ferrari",
  "Lamborghini", "Toyota", "Honda", "Nissan", "Mazda", "Subaru",
  "Ford", "Chevrolet", "Dodge", "Jeep", "Tesla", "Volvo"
];

const DevBrandsTab = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="structure">Data Structure</TabsTrigger>
        <TabsTrigger value="raw">Raw Data</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Data Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">Static Data</Badge>
                <p className="text-xs text-muted-foreground">Hardcoded brand list</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandsData.length}</div>
              <p className="text-xs text-muted-foreground">Brand entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="default" className="bg-green-600">Active</Badge>
                <p className="text-xs text-muted-foreground">Ready for display</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="structure" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Brand Data Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Index</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Length</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brandsData.map((brand, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{index}</TableCell>
                    <TableCell>{brand}</TableCell>
                    <TableCell className="font-mono text-xs">string</TableCell>
                    <TableCell className="font-mono text-xs">{brand.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="raw" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Raw Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
              <code>{JSON.stringify(brandsData, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DevBrandsTab;