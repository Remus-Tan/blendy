"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

async function updateLike(
    likes: boolean,
    checkLike: string
) {
    const result = fetch(checkLike, {
        method: likes ? "Delete" : "Post",
    }).then(async res => {
        res = await res.json();
        console.log(res);
    });
}

export default function LikeButton({
    loggedInUser,
    targetModel,
    targetCreator
}: {
    loggedInUser: string,
    targetModel: number
    targetCreator: string,
}) {
    const [isFetching, setIsFetching] = useState(true);
    const [likes, setLikes] = useState(true);
    const [likesQty, setLikesQty] = useState(0);
    const [hovering, setHover] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const checkLike = process.env.NEXT_PUBLIC_BASE_URL + "/api/models/like-data/" + loggedInUser + "?target=" + targetModel;
    const countLikes = process.env.NEXT_PUBLIC_BASE_URL + "/api/models/like-data/" + targetModel;

    useEffect(() => {
        console.log(checkLike);
        fetch(checkLike, { next: { revalidate: 0 } }).then(async res => {
            setIsFetching(false);
            if (res.ok) {
                console.log(JSON.stringify(await res.json()));
                setLikes(true);
            } else {
                setLikes(false);
            }
        });

        fetch(countLikes, { next: { revalidate: 0 } }).then(async res => {
            setLikesQty(await res.json());
        });

    }, []);

    return (
        <>
            {
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger className={cn(
                            targetCreator == loggedInUser && "cursor-default"
                        )}
                        >
                            <Button
                                className={
                                    cn("p-2 h-fit flex gap-1 text-sm bg-background border border-slate-500 text-slate-500",
                                        isFetching && "text-primary",
                                        likes && "bg-primary border-primary",
                                        hovering && "bg-primary border-primary",
                                        isUpdating && "",
                                    )}
                                disabled={isFetching || isUpdating || targetCreator == loggedInUser}
                                onMouseEnter={() => { setHover(true); }}
                                onMouseLeave={() => { setHover(false); }}
                                onClick={() => {
                                    updateLike(likes, checkLike);
                                    if (likes) {
                                        setLikes(false);
                                        setLikesQty(likesQty - 1);
                                    } else {
                                        setLikes(true);
                                        setLikesQty(likesQty + 1);
                                    };
                                    setIsUpdating(true);
                                    setTimeout(() => setIsUpdating(false), 200);
                                }}
                            >
                                <Star
                                    fill="white"
                                    color={hovering || likes ? "white" : "#bfbfbf"}
                                    size={16}
                                />
                                <p className={hovering || likes ? "text-white" : ""}>{likesQty}</p>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-stone-700 text-white">
                            {likes ? "Unlike" : "Like"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            }
        </>
    );
}