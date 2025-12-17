import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from "@/components/ui/use-toast";
import { ChevronDown, Info, Settings, Palette, Component, Search, TrendingUp, Users as UsersIcon, Mail, Link2, Trash2, Edit } from "lucide-react";
import { CustomCardLayout, StatsWidget, DataTableRow } from "@/components/workshop";

interface LinkedComponent {
  id: string;
  name: string;
  baseComponent: string;
  description: string;
}

const ShadcnWorkshopPage = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>("buttons");
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progressValue, setProgressValue] = useState(50);
  const [sliderValue, setSliderValue] = useState([50]);
  const [linkedComponents, setLinkedComponents] = useState<Record<string, LinkedComponent>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingPlaceholder, setEditingPlaceholder] = useState<string | null>(null);
  const [placeholderName, setPlaceholderName] = useState<string>("");
  const [placeholderDescription, setPlaceholderDescription] = useState<string>("");

  const componentCategories = [
    {
      category: "Form Elements",
      components: [
        { id: "buttons", name: "Buttons" },
        { id: "inputs", name: "Inputs" },
        { id: "selects", name: "Selects" },
        { id: "checkboxes", name: "Checkboxes & Radio" },
        { id: "switches", name: "Switches" },
        { id: "sliders", name: "Sliders" },
        { id: "textareas", name: "Textareas" },
      ]
    },
    {
      category: "Display Components",
      components: [
        { id: "cards", name: "Cards" },
        { id: "badges", name: "Badges" },
        { id: "avatars", name: "Avatars" },
        { id: "tables", name: "Tables" },
        { id: "alerts", name: "Alerts" },
      ]
    },
    {
      category: "Overlays",
      components: [
        { id: "dialogs", name: "Dialogs" },
        { id: "popovers", name: "Popovers" },
        { id: "tooltips", name: "Tooltips" },
        { id: "dropdowns", name: "Dropdown Menus" },
        { id: "hovercards", name: "Hover Cards" },
      ]
    },
    {
      category: "Navigation",
      components: [
        { id: "tabs", name: "Tabs" },
        { id: "accordion", name: "Accordion" },
        { id: "breadcrumbs", name: "Breadcrumbs" },
        { id: "menubar", name: "Menubar" },
        { id: "navigation", name: "Navigation Menu" },
      ]
    },
    {
      category: "Feedback",
      components: [
        { id: "progress", name: "Progress" },
        { id: "toasts", name: "Toasts" },
        { id: "alertdialogs", name: "Alert Dialogs" },
      ]
    },
    {
      category: "Layout",
      components: [
        { id: "separator", name: "Separator" },
        { id: "scrollarea", name: "Scroll Area" },
        { id: "carousel", name: "Carousel" },
        { id: "collapsible", name: "Collapsible" },
      ]
    },
    {
      category: "Utilities",
      components: [
        { id: "calendar", name: "Calendar" },
        { id: "toggles", name: "Toggles" },
      ]
    },
    {
      category: "Custom Components",
      components: [
        { id: "custom-card-layout", name: "Custom Card Layout" },
        { id: "stats-widget", name: "Stats Widget" },
        { id: "data-table-row", name: "Data Table Row" },
      ]
    }
  ];

  const filteredCategories = componentCategories.map(cat => ({
    ...cat,
    components: cat.components.filter(comp =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.components.length > 0);

  const placeholders = [
    { id: 'placeholder-1', defaultName: 'Custom Card Layout', defaultDesc: 'Build a custom card with image, title, and actions' },
    { id: 'placeholder-2', defaultName: 'Stats Widget', defaultDesc: 'Stats card with icon, value, and trend' },
    { id: 'placeholder-3', defaultName: 'Data Table Row', defaultDesc: 'Custom table row with actions' },
    { id: 'placeholder-4', defaultName: 'Form Layout', defaultDesc: 'Multi-field form component' },
    { id: 'placeholder-5', defaultName: 'Navigation Item', defaultDesc: 'Custom nav with icons and badges' },
    { id: 'placeholder-6', defaultName: 'Modal Dialog', defaultDesc: 'Custom dialog with form' },
  ];

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id.toString().startsWith('placeholder-')) {
      const componentName = active.id.toString();
      const placeholderId = over.id.toString();

      setLinkedComponents(prev => ({
        ...prev,
        [placeholderId]: {
          id: placeholderId,
          name: placeholders.find(p => p.id === placeholderId)?.defaultName || 'New Component',
          baseComponent: componentName,
          description: placeholders.find(p => p.id === placeholderId)?.defaultDesc || ''
        }
      }));

      toast({
        title: "Component Linked",
        description: `${componentName} linked to placeholder. Click to rename.`
      });
    }

    setActiveId(null);
  };

  const handleSavePlaceholder = (placeholderId: string) => {
    if (linkedComponents[placeholderId]) {
      setLinkedComponents(prev => ({
        ...prev,
        [placeholderId]: {
          ...prev[placeholderId],
          name: placeholderName,
          description: placeholderDescription
        }
      }));
    }
    setEditingPlaceholder(null);
    setPlaceholderName("");
    setPlaceholderDescription("");
    toast({ title: "Saved", description: "Component configuration updated" });
  };

  const handleEditPlaceholder = (placeholderId: string) => {
    const linked = linkedComponents[placeholderId];
    if (linked) {
      setEditingPlaceholder(placeholderId);
      setPlaceholderName(linked.name);
      setPlaceholderDescription(linked.description);
    }
  };

  const handleDeleteLink = (placeholderId: string) => {
    setLinkedComponents(prev => {
      const newLinks = { ...prev };
      delete newLinks[placeholderId];
      return newLinks;
    });
    toast({ title: "Unlinked", description: "Component link removed" });
  };

  const renderComponentPreview = () => {
    switch (selectedComponent) {
      case "buttons":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <DraggablePreviewItem id="button-default">
                  <Button>Default</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-secondary">
                  <Button variant="secondary">Secondary</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-destructive">
                  <Button variant="destructive">Destructive</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-outline">
                  <Button variant="outline">Outline</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-ghost">
                  <Button variant="ghost">Ghost</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-link">
                  <Button variant="link">Link</Button>
                </DraggablePreviewItem>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <DraggablePreviewItem id="button-sm">
                  <Button size="sm">Small</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-default-size">
                  <Button size="default">Default</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-lg">
                  <Button size="lg">Large</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-icon">
                  <Button size="icon">⚙</Button>
                </DraggablePreviewItem>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Button States</h3>
              <div className="flex flex-wrap gap-3">
                <DraggablePreviewItem id="button-normal">
                  <Button>Normal</Button>
                </DraggablePreviewItem>
                <DraggablePreviewItem id="button-disabled">
                  <Button disabled>Disabled</Button>
                </DraggablePreviewItem>
              </div>
            </div>
          </div>
        );

      case "inputs":
        return (
          <div className="space-y-6 max-w-md">
            <DraggablePreviewItem id="input-email" className="block">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
            </DraggablePreviewItem>
            <DraggablePreviewItem id="input-password" className="block">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password" />
              </div>
            </DraggablePreviewItem>
            <DraggablePreviewItem id="input-disabled" className="block">
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled Input</Label>
                <Input id="disabled" disabled value="Disabled input" />
              </div>
            </DraggablePreviewItem>
            <DraggablePreviewItem id="input-file" className="block">
              <div className="space-y-2">
                <Label htmlFor="file">File Upload</Label>
                <Input id="file" type="file" />
              </div>
            </DraggablePreviewItem>
          </div>
        );

      case "selects":
        return (
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label>Select an option</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "checkboxes":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Checkboxes</h3>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Accept terms and conditions
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="marketing" defaultChecked />
                <label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Receive marketing emails
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Radio Buttons</h3>
              <RadioGroup defaultValue="option1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="option1" />
                  <Label htmlFor="option1">Option 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="option2" />
                  <Label htmlFor="option2">Option 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="option3" />
                  <Label htmlFor="option3">Option 3</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "switches":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" defaultChecked />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="disabled" disabled />
              <Label htmlFor="disabled">Disabled</Label>
            </div>
          </div>
        );

      case "sliders":
        return (
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label>Volume: {sliderValue[0]}</Label>
              <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
            </div>
          </div>
        );

      case "textareas":
        return (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message here" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled-textarea">Disabled</Label>
              <Textarea id="disabled-textarea" disabled placeholder="Disabled textarea" />
            </div>
          </div>
        );

      case "cards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DraggablePreviewItem id="card-simple" className="block">
              <Card>
                <CardHeader>
                  <CardTitle>Simple Card</CardTitle>
                  <CardDescription>This is a simple card description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content goes here</p>
                </CardContent>
              </Card>
            </DraggablePreviewItem>
            <DraggablePreviewItem id="card-with-button" className="block">
              <Card>
                <CardHeader>
                  <CardTitle>Another Card</CardTitle>
                  <CardDescription>With some actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>This card has a button</p>
                  <Button size="sm">Click me</Button>
                </CardContent>
              </Card>
            </DraggablePreviewItem>
          </div>
        );

      case "badges":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <DraggablePreviewItem id="badge-default">
                <Badge>Default</Badge>
              </DraggablePreviewItem>
              <DraggablePreviewItem id="badge-secondary">
                <Badge variant="secondary">Secondary</Badge>
              </DraggablePreviewItem>
              <DraggablePreviewItem id="badge-destructive">
                <Badge variant="destructive">Destructive</Badge>
              </DraggablePreviewItem>
              <DraggablePreviewItem id="badge-outline">
                <Badge variant="outline">Outline</Badge>
              </DraggablePreviewItem>
            </div>
          </div>
        );

      case "avatars":
        return (
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        );

      case "tables":
        return (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">John Doe</TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Jane Smith</TableCell>
                  <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>This is an informational alert</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>This is an error alert</AlertDescription>
            </Alert>
          </div>
        );

      case "dialogs":
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>This is a dialog description</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here</p>
              </div>
            </DialogContent>
          </Dialog>
        );

      case "popovers":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button>Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <h4 className="font-medium">Popover Title</h4>
                <p className="text-sm text-muted-foreground">This is a popover content</p>
              </div>
            </PopoverContent>
          </Popover>
        );

      case "tooltips":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        );

      case "dropdowns":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Open Menu <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );

      case "hovercards":
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@username</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-2">
                <h4 className="font-medium">@username</h4>
                <p className="text-sm text-muted-foreground">User bio goes here</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        );

      case "tabs":
        return (
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p>Content for Tab 1</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p>Content for Tab 2</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p>Content for Tab 3</p>
            </TabsContent>
          </Tabs>
        );

      case "accordion":
        return (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion Item 1</AccordionTrigger>
              <AccordionContent>
                Content for accordion item 1
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Accordion Item 2</AccordionTrigger>
              <AccordionContent>
                Content for accordion item 2
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );

      case "breadcrumbs":
        return (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current Page</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        );

      case "menubar":
        return (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New</MenubarItem>
                <MenubarItem>Open</MenubarItem>
                <MenubarItem>Save</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Cut</MenubarItem>
                <MenubarItem>Copy</MenubarItem>
                <MenubarItem>Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        );

      case "navigation":
        return (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[400px]">
                    <p className="text-sm">Navigation menu content</p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2">
                  Documentation
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        );

      case "progress":
        return (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Progress: {progressValue}%</Label>
              <Progress value={progressValue} />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>-10</Button>
                <Button size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>+10</Button>
              </div>
            </div>
          </div>
        );

      case "toasts":
        return (
          <div className="space-y-2">
            <Button onClick={() => toast({ title: "Success", description: "This is a success toast" })}>
              Show Toast
            </Button>
            <Button variant="destructive" onClick={() => toast({ title: "Error", description: "This is an error toast", variant: "destructive" })}>
              Show Error Toast
            </Button>
          </div>
        );

      case "alertdialogs":
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Item</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );

      case "separator":
        return (
          <div className="space-y-4">
            <div>Section 1</div>
            <Separator />
            <div>Section 2</div>
            <Separator />
            <div>Section 3</div>
          </div>
        );

      case "scrollarea":
        return (
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            <div className="space-y-2">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="text-sm">
                  Scroll item {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        );

      case "carousel":
        return (
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        );

      case "collapsible":
        return (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Toggle Collapsible <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 border rounded-md">
              This is the collapsible content
            </CollapsibleContent>
          </Collapsible>
        );

      case "calendar":
        return (
          <div className="flex justify-center">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </div>
        );

      case "toggles":
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Toggle>Toggle 1</Toggle>
              <Toggle>Toggle 2</Toggle>
            </div>
            <ToggleGroup type="single">
              <ToggleGroupItem value="a">A</ToggleGroupItem>
              <ToggleGroupItem value="b">B</ToggleGroupItem>
              <ToggleGroupItem value="c">C</ToggleGroupItem>
            </ToggleGroup>
          </div>
        );

      case "custom-card-layout":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DraggablePreviewItem id="custom-card-sample" className="block">
              <CustomCardLayout
                title="Sample Card"
                description="This is a custom card layout component with image, title, description, and action buttons."
                primaryAction="Learn More"
                secondaryAction="Share"
                onPrimaryClick={() => toast({ title: "Primary Action", description: "You clicked the primary button" })}
                onSecondaryClick={() => toast({ title: "Secondary Action", description: "You clicked the secondary button" })}
              />
            </DraggablePreviewItem>
            <DraggablePreviewItem id="custom-card-featured" className="block">
              <CustomCardLayout
                image="https://placehold.co/400x200/3b82f6/white?text=Featured"
                title="Featured Item"
                description="Another example of the custom card layout with different styling."
                primaryAction="View Details"
                onPrimaryClick={() => toast({ title: "View Details", description: "Opening details..." })}
              />
            </DraggablePreviewItem>
          </div>
        );

      case "stats-widget":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DraggablePreviewItem id="stats-widget-users" className="block">
              <StatsWidget
                icon={<UsersIcon className="h-4 w-4" />}
                value="12,345"
                label="Total Users"
                trend="+12.5%"
                trendDirection="up"
                variant="success"
              />
            </DraggablePreviewItem>
            <DraggablePreviewItem id="stats-widget-revenue" className="block">
              <StatsWidget
                icon={<TrendingUp className="h-4 w-4" />}
                value="$45,231"
                label="Revenue"
                trend="+8.2%"
                trendDirection="up"
                variant="default"
              />
            </DraggablePreviewItem>
            <DraggablePreviewItem id="stats-widget-messages" className="block">
              <StatsWidget
                icon={<Mail className="h-4 w-4" />}
                value="573"
                label="Messages"
                trend="-2.4%"
                trendDirection="down"
                variant="warning"
              />
            </DraggablePreviewItem>
          </div>
        );

      case "data-table-row":
        return (
          <DraggablePreviewItem id="data-table-example" className="block">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <DataTableRow
                    avatar={{ fallback: "JD", src: "https://github.com/shadcn.png" }}
                    fields={[
                      { label: "", value: "John Doe" },
                      { label: "", value: "john@example.com" },
                      { label: "", value: <Badge>Admin</Badge> }
                    ]}
                    actions={[
                      { label: "Edit", onClick: () => toast({ title: "Edit clicked" }) },
                      { label: "Delete", onClick: () => toast({ title: "Delete clicked" }), variant: "destructive" }
                    ]}
                    selected={false}
                    onSelect={(selected) => console.log("Selected:", selected)}
                  />
                  <DataTableRow
                    avatar={{ fallback: "JS" }}
                    fields={[
                      { label: "", value: "Jane Smith" },
                      { label: "", value: "jane@example.com" },
                      { label: "", value: <Badge variant="secondary">User</Badge> }
                    ]}
                    actions={[
                      { label: "Edit", onClick: () => toast({ title: "Edit clicked" }) },
                      { label: "Delete", onClick: () => toast({ title: "Delete clicked" }), variant: "destructive" }
                    ]}
                    selected={true}
                    onSelect={(selected) => console.log("Selected:", selected)}
                  />
                </TableBody>
              </Table>
            </div>
          </DraggablePreviewItem>
        );

      default:
        return <div className="text-muted-foreground">Select a component to preview</div>;
    }
  };

  // Draggable wrapper for preview items on canvas
  const DraggablePreviewItem = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id,
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          opacity: isDragging ? 0.5 : 1,
        }
      : undefined;

    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`cursor-grab active:cursor-grabbing inline-block ${className}`}>
        {children}
      </div>
    );
  };

  // Render component preview for placeholder cards
  const renderComponentPreviewSmall = (componentId: string) => {
    const scaleClass = "scale-75 origin-top-left pointer-events-none";

    switch (componentId) {
      case "button-default":
      case "button-secondary":
      case "button-destructive":
      case "button-outline":
      case "button-ghost":
      case "button-link":
        const variant = componentId.replace("button-", "") as any;
        return <div className={scaleClass}><Button variant={variant}>{variant.charAt(0).toUpperCase() + variant.slice(1)}</Button></div>;

      case "card-simple":
      case "card-with-button":
        return (
          <div className={scaleClass}>
            <Card className="w-48">
              <CardHeader><CardTitle className="text-sm">Card Preview</CardTitle></CardHeader>
              <CardContent className="text-xs">Sample content</CardContent>
            </Card>
          </div>
        );

      case "badge-default":
      case "badge-secondary":
      case "badge-destructive":
      case "badge-outline":
        const badgeVariant = componentId.replace("badge-", "") as any;
        return <div className={scaleClass}><Badge variant={badgeVariant}>{badgeVariant}</Badge></div>;

      case "input-email":
      case "input-password":
        return <div className={scaleClass}><Input className="w-48" placeholder="Input preview" /></div>;

      case "custom-card-sample":
      case "custom-card-featured":
        return (
          <div className={scaleClass}>
            <CustomCardLayout
              title="Preview"
              description="Custom card preview"
              primaryAction="Action"
              onPrimaryClick={() => {}}
            />
          </div>
        );

      case "stats-widget-users":
      case "stats-widget-revenue":
      case "stats-widget-messages":
        return (
          <div className={scaleClass}>
            <StatsWidget
              icon={<TrendingUp className="h-3 w-3" />}
              value="1,234"
              label="Preview"
              trend="+5%"
              trendDirection="up"
            />
          </div>
        );

      case "data-table-example":
        return (
          <div className={scaleClass}>
            <div className="rounded border p-2 text-xs">
              <div className="font-medium">Table Preview</div>
              <div className="text-muted-foreground">Data table row</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-xs text-muted-foreground border-2 border-dashed rounded p-2">
            {componentId} preview
          </div>
        );
    }
  };

  // Droppable placeholder card
  const DroppablePlaceholder = ({ placeholder }: { placeholder: typeof placeholders[0] }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: placeholder.id,
    });

    const linked = linkedComponents[placeholder.id];
    const isEditing = editingPlaceholder === placeholder.id;

    return (
      <Card
        ref={setNodeRef}
        className={`border-dashed border-2 transition-all ${
          isOver ? 'border-primary bg-primary/5 scale-105' : linked ? 'border-green-500 bg-green-500/5' : ''
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {linked && <Link2 className="h-3 w-3 text-green-600" />}
              {linked ? linked.name : placeholder.defaultName}
            </CardTitle>
            {linked && !isEditing && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleEditPlaceholder(placeholder.id)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleDeleteLink(placeholder.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={placeholderName}
                  onChange={(e) => setPlaceholderName(e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={placeholderDescription}
                  onChange={(e) => setPlaceholderDescription(e.target.value)}
                  className="h-16 text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSavePlaceholder(placeholder.id)}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingPlaceholder(null);
                    setPlaceholderName("");
                    setPlaceholderDescription("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-2">
                {linked
                  ? `Base: ${linked.baseComponent} - ${linked.description}`
                  : `Placeholder: ${placeholder.defaultDesc}`}
              </p>
              {!linked && (
                <div className="text-xs text-center py-4 text-muted-foreground border-2 border-dashed rounded">
                  Drag component here
                </div>
              )}
              {linked && (
                <div className="overflow-hidden">
                  {renderComponentPreviewSmall(linked.baseComponent)}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <DashboardLayout title="shadcn Workshop" showFilterButton={false}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Component className="h-8 w-8" />
              <h1 className="text-3xl font-bold">shadcn/ui Workshop</h1>
            </div>
            <p className="text-muted-foreground">
              Browse, test, and customize shadcn/ui components in your admin tools
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Component Selector */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {filteredCategories.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          {category.category}
                        </h3>
                        <div className="space-y-1">
                          {category.components.map((component) => (
                            <Button
                              key={component.id}
                              variant={selectedComponent === component.id ? "secondary" : "ghost"}
                              className="w-full justify-start"
                              onClick={() => setSelectedComponent(component.id)}
                            >
                              {component.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Preview Area */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  Interactive preview with grid background - Design and test components
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Grid Background Preview Area */}
                <div
                  className="min-h-[600px] p-8 border rounded-lg relative overflow-hidden"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                      linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundColor: 'hsl(var(--muted) / 0.3)'
                  }}
                >
                  {/* Content overlay on grid */}
                  <div className="relative z-10 bg-background/80 backdrop-blur-sm rounded-lg p-6 border">
                    {renderComponentPreview()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Components Section */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Component Placeholders</CardTitle>
              <CardDescription>
                Create placeholder components that can be referenced and built later
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {placeholders.map((placeholder) => (
                    <DroppablePlaceholder key={placeholder.id} placeholder={placeholder} />
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    + Add New Component Placeholder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage and add new components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => window.open('https://ui.shadcn.com/docs/components', '_blank')}>
                  View Documentation
                </Button>
                <Button variant="outline" onClick={() => window.open('https://ui.shadcn.com/', '_blank')}>
                  Browse Components
                </Button>
                <Button variant="outline" onClick={() => toast({ title: "Saved", description: "Component configuration saved to workshop" })}>
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
      <DragOverlay>
        {activeId ? (
          <div className="bg-primary/20 border-2 border-primary rounded-lg p-2 text-sm font-medium">
            {activeId}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ShadcnWorkshopPage;
