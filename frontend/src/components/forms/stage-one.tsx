"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
  language: z.array(z.string()).nonempty("Please select at least one language."),
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
      lang: [],
      tone: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
    
    } catch (error) {
      console.error("Form submission error", error);
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
                      {audienceTypes.map((each, key) =>  <MultiSelectorItem key={key} value={each}>{each}</MultiSelectorItem>)}
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
                      
                    {languageTypes.map((each, key) =>  <MultiSelectorItem key={key} value={each}>{each}</MultiSelectorItem>)}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              {/* <FormDescription>
                Choose the language(s) in which you want the content to be
                generated. You can select multiple languages.
              </FormDescription> */}
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
                      
                    {toneTypes.map((each, key) =>  <MultiSelectorItem key={key} value={each}>{each}</MultiSelectorItem>)}
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
