import StagOneForm from "@/components/forms/stage-one";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid grid-cols-2 justify-center align-middle items-center min-h-svh p-6 gap-6">
      <div className="w-full max-w-[500px] m-auto mr-0">
        <h1 className="text-4xl text-sans">AI Content creation</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit
          amet erat libero. Donec at molestie urna. Curabitur vitae magna quis
          mauris tempor semper vitae tincidunt quam. Proin placerat, sem eget
          convallis suscipit, lorem diam laoreet nunc, viverra blandit nulla
          neque sit amet dui. Ut malesuada massa dictum, vehicula nunc non,
          eleifend tellus. Integer lacinia quis enim at interdum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Pellentesque habitant
          morbi tristique senectus et netus et malesuada fames ac turpis
          egestas.
        </p>
      </div>
      <div>
        <div className="w-full max-w-[500px] m-auto ml-0">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>User Inputs</CardTitle>
              <CardDescription>
                Please provide the specific input or details you’d like to use
                to generate content with AI.{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StagOneForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
