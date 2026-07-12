import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/cardboard/tabs";
import { ComponentPage, Demo } from "../_component-page";

export default function TabsDocs() {
  return (
    <ComponentPage
      title="Tabs"
      description="Switches between related panels. A filled default style and an underline 'line' variant."
    >
      <Demo title="Default">
        <Tabs defaultValue="overview" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-2 text-tertiary">The overview panel.</TabsContent>
          <TabsContent value="activity" className="pt-2 text-tertiary">Recent activity.</TabsContent>
          <TabsContent value="settings" className="pt-2 text-tertiary">Your settings.</TabsContent>
        </Tabs>
      </Demo>

      <Demo title="Line variant">
        <Tabs defaultValue="one" className="w-full max-w-md">
          <TabsList variant="line">
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="pt-2 text-tertiary">First panel.</TabsContent>
          <TabsContent value="two" className="pt-2 text-tertiary">Second panel.</TabsContent>
        </Tabs>
      </Demo>
    </ComponentPage>
  );
}
