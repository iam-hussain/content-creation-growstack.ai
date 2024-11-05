"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { TagsInput } from "@/components/ui/tags-input";
import { audienceTypes, languageTypes, toneTypes } from "@/lib/constants";
import fetcher from "@/lib/fetcher";

const formSchema = z.object({
  email: z
    .string()
    .nonempty("Email address is required.")
    .email("Please enter a valid email address."),
  keywords: z
    .array(z.string())
    .nonempty("Please enter at least one keyword or URL to proceed."),
  audience: z
    .array(z.string())
    .nonempty("Please select at least one audience segment."),
  language: z.string().nonempty("Please select at least one language."),
  tone: z
    .array(z.string())
    .nonempty("Please select at least one tone for the content."),
});

export default function StagOneForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: [],
      audience: [],
      language: "",
      tone: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);

      const response = await fetcher.post(
        "http://localhost:4000/content/generate",
        {
          body: values,
        }
      );

      console.log({ response });

      toast.success("Your inputs are processed successfully");
    } catch {
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-3xl mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email address"
                  type="email"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                Please provide your email address for notifications and updates
                on the workflow.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords or URLs</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Enter your tags"
                />
              </FormControl>
              {/* <FormDescription>
                Provide keywords or URLs to guide the AI search. You can enter
                multiple keywords or URLs by pressing Enter after each entry.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Targeted Audience</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value}
                  onValuesChange={field.onChange}
                  loop
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select targeted audience" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {audienceTypes.map((each, key) => (
                        <MultiSelectorItem key={key} value={each}>
                          {each}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              {/* <FormDescription>
                Select one or more audience segments to personalize the content.
                You can choose multiple options.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select languages" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {languageTypes.map((each, key) => (
                    <SelectItem key={key} value={each}>
                      {each}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value}
                  onValuesChange={field.onChange}
                  loop
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select languages" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {toneTypes.map((each, key) => (
                        <MultiSelectorItem key={key} value={each}>
                          {each}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              {/* <FormDescription>
                Specify the tone you want for the content, such as formal,
                conversational, or humorous. You can select multiple tones.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className="mt-4 w-full">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
}
