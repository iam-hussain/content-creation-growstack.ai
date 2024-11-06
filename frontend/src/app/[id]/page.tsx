"use client";

import { useQuery, useSubscription } from "@apollo/client";

import { ContentByUserInput, StatusUpdater } from "@/lib/query";

export default function Content({ params }: any) {
    const { data: subData } = useSubscription(StatusUpdater);
    const { loading, error, data } = useQuery(ContentByUserInput, {
        variables: { userInputId: Number(params?.id || 0) },
    });

    if (error || subData?.message === "error")
        return <p>Error: {error?.message || "Something went wrong...."}</p>;

    const { blog, twitter, linkedin, facebook, instagram, threads } =
        data?.contentByUserInput[0] || {};

    if (
        loading ||
        !blog ||
        !twitter ||
        !linkedin ||
        !facebook ||
        !instagram ||
        !threads
    ) {
        return (
            <div className="h-full w-full flex justify-center align-middle items-center py-10">
                <h1 className="test-2xl">Creating your content...</h1>
                {subData?.id === params?.id && subData?.stage ? (
                    <h1 className="test-2xl">Working on {subData?.stage}</h1>
                ) : (
                    <></>
                )}
            </div>
        );
    }
    return (
        <div className="h-full w-full flex justify-center align-middle items-center py-10">
            <div className="flex flex-col w-full gap-2 py-4 px-2 ">
                <div className="flex justify-between text-sm border-b">
                    <strong className="text-sm text-foreground/80">Blog:</strong> {blog}
                </div>
                <div className="flex justify-between text-sm border-b">
                    <strong className="text-sm text-foreground/80">Twitter:</strong>{" "}
                    {twitter}
                </div>
                <div className="flex justify-between text-sm border-b">
                    <strong className="text-sm text-foreground/80">Linkedin:</strong>{" "}
                    {linkedin}
                </div>
                <div className="flex justify-between text-sm border-b">
                    <strong className="text-sm text-foreground/80">Facebook:</strong>{" "}
                    {facebook}
                </div>
                <div className="flex justify-between text-sm border-b">
                    <strong className="text-sm text-foreground/80">Instagram:</strong>{" "}
                    {instagram}
                </div>
                <div className="flex justify-between text-sm border-b">
                    <strong className="text-sm text-foreground/80">threads:</strong>{" "}
                    {threads}
                </div>
            </div>
        </div>
    );
}
