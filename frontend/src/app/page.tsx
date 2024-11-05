import StagOneForm from "@/components/forms/stage-one";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid grid-cols-2 justify-center align-middle items-center min-h-svh p-6 gap-6">
      <div className="w-full max-w-[500px] m-auto mr-0">
          <h1>AI Content creation</h1>
      </div>
      <div>
      <div className="w-full max-w-[500px] m-auto ml-0">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Inputs</CardTitle>
          <CardDescription>Please provide the specific input or details you’d like to use to generate content with AI. </CardDescription>
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
