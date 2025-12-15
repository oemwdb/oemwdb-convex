import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { allWheels } from "@/data/wheelsData";

const DevWheelsTab = () => {
  const sampleWheels = allWheels.slice(0, 10);

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
                <Badge variant="secondary">wheelsData.ts</Badge>
                <p className="text-xs text-muted-foreground">Generated static data</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allWheels.length}</div>
              <p className="text-xs text-muted-foreground">Wheel entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="default" className="bg-green-600">Active</Badge>
                <p className="text-xs text-muted-foreground">Static data loaded</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="structure" className="mt-0">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wheel Data Structure (Sample)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Diameter</TableHead>
                    <TableHead>Bolt Pattern</TableHead>
                    <TableHead>Offset</TableHead>
                    <TableHead>Center Bore</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleWheels.map((wheel, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{wheel.name}</TableCell>
                      <TableCell className="font-mono">{wheel.diameter}</TableCell>
                      <TableCell className="font-mono">{wheel.boltPattern}</TableCell>
                      <TableCell className="font-mono">{wheel.offset}</TableCell>
                      <TableCell className="font-mono">{wheel.centerBore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                <code>{`interface Wheel {
  id: string;
  name: string;
  brand: string;
  diameter: string;
  width: string;
  offset: string;
  boltPattern: string;
  centerBore: string;
  finishColor: string;
  price: string;
  description: string;
  specs: string[];
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="raw" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Sample Raw Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
              <code>{JSON.stringify(sampleWheels[0], null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DevWheelsTab;