import { auth } from "@clerk/nextjs";
import SettingsForm from "./_components/settings-forms";
import { Model } from "@prisma/client";
import { redirect } from "next/navigation";
import ModelViewer from "./_components/model-viewer";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: 'Model Settings - Blendy',
    description: 'Settings for your model',
};
export default async function Settings(
    { params }: { params: { id: string } }
) {
    const user = auth();

    const model: Model = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/models/${params.id}`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                redirect(`/models/${params.id}`);
            }
        });

    if (user.userId != model.creatorId) {
        redirect(`/models/${params.id}`);
    }

    return (
        <div className="
            md:flex
            m-6 justify-center
            ">
            <ModelViewer modelId={params.id} sizeClass="md:w-1/2 w-auto aspect-[3/2]" />
            <Separator className="md:hidden flex my-4" />
            <SettingsForm modelId={params.id} />

        </div>
    );
}