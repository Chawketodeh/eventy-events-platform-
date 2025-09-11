import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main>
  <Button>Primary</Button>
<Button variant="secondary" className="ml-2">Secondary</Button>
<Button variant="outline" className="ml-2">Outline</Button>
<p className="test-red">Tailwind works</p>
<Button className="test-blue">Utility button</Button>




     <h1 className="text-4xl text-red-500">Hello Tailwind</h1>

<div className="space-x-2">
  <button className="bg-primary text-primary-foreground px-3 py-1 rounded">Primary</button>
  <button className="bg-secondary text-secondary-foreground px-3 py-1 rounded">Secondary</button>
  <button className="border border-border px-3 py-1 rounded">Outline</button>
  <p className="test-red">Tailwind works</p>
<button className="test-blue">Utility button</button>

</div>
<Button variant="destructive">Delete</Button>



    </main> 
  );
}
