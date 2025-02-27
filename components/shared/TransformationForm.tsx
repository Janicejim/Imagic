"use client"

import React, { startTransition, useEffect, useState, useTransition } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'
import { CustomField } from './CustomField'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import { updateCredits } from '@/lib/actions/user.actions'
import MediaUploader from './MediaUploader'
import TransformedImage from './TransformedImage'
import { getCldImageUrl } from 'next-cloudinary'
import { addImage, updateImage } from '@/lib/actions/image.actions'
import { useRouter } from "next/navigation"
import { InsufficientCreditsModal } from './InsufficientCreditsModal'


export const formSchema = z.object({

    title: z.string(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string(),
})
const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) => {
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isTransforming, setIsTransforming] = useState<boolean>(false)
    const [transformationConfig, setTransformationConfig] = useState(config)
    const [isPending, isTransition] = useTransition()
    const initialValues = data && action === 'Update' ? {
        title: data.title,
        aspectRatio: data.aspectRatio,
        color: data.color,
        prompt: data.prompt,
        publicId: data.publicId,
    } : defaultValues

    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        if (data || image) {
            const transformationUrl = getCldImageUrl({
                width: image?.width,
                height: image?.height,
                src: image?.publicId,
                ...transformationConfig
            })

            const imageData = {
                title: values.title,
                publicId: image?.publicId,
                transformationType: type,
                width: image?.width,
                height: image?.height,
                config: transformationConfig,
                secureURL: image?.secureURL,
                transformationURL: transformationUrl,
                aspectRatio: values.aspectRatio,
                prompt: values.prompt,
                color: values.color
            }

            if (action === "Add") {
                try {
                    const newImage = await addImage({
                        image: imageData,
                        userId,
                        path: "/i"
                    })
                    if (newImage) {
                        form.reset()
                        setImage(data)
                        router.push(`/transformations/${newImage._id}`)
                    }
                } catch (err) {
                    console.log(err)
                }
            }
            if (action === "Update") {
                try {
                    const updatedImage = await updateImage({
                        image: {
                            ...imageData,
                            _id: data._id,

                        },
                        userId,
                        path: `/transformation/${data._id}`
                    })
                    if (updatedImage) {
                        router.push(`/transformations/${updatedImage._id}`)
                    }
                } catch (err) {
                    console.log(err)
                }
            }

        }
        setIsSubmitting(false)
    }

    const transformationType = transformationTypes[type]
    const [image, setImage] = useState(data)

    const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        const imageSize = aspectRatioOptions[value as AspectRatioKey]
        setImage((prevState: any) => ({ ...prevState, aspectRatio: imageSize.aspectRatio, width: imageSize.width, height: imageSize.height }))
        setNewTransformation(transformationType.config)
        return onChangeField(value)
    }

    const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
        debounce(() => {
            setNewTransformation((prevState: any) => ({
                ...prevState, [type]: {
                    ...prevState?.[type],
                    [fieldName === "prompt" ? "prompt" : "to"]: value
                }
            }))

        }, 1000)() //debounce防止未input完就不斷send input內容去db,減低負荷
        return onChangeField(value)
    }

    const onTransformHandler = async () => {
        setIsTransforming(true)
        setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig))
        setNewTransformation(null)
        startTransition(async () => { await updateCredits(userId, creditFee) })
    }

    useEffect(() => {
        if (image && (type === "removeBackground")) {
            setNewTransformation(transformationType.config)
        }
    }, [image, transformationType.config, type])


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
                <CustomField className="w-full"
                    control={form.control}
                    name="title"
                    formLabel="Image Title"
                    render={({ field }) => <Input {...field} className='input-field' />} />
                {type === "fill" &&
                    <CustomField
                        control={form.control}
                        name="aspectRatio"
                        formLabel='Aspect Ratio'
                        className='w-full'
                        render={({ field }) => (
                            <Select
                                onValueChange={
                                    (value) => onSelectFieldHandler(value, field.onChange)
                                }
                                value={field.value}
                            >
                                <SelectTrigger className="select-field">
                                    <SelectValue placeholder="Select Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(aspectRatioOptions).map((key) => (
                                        <SelectItem key={key} value={key} className='select-item' >
                                            {aspectRatioOptions[key as AspectRatioKey].label}
                                        </SelectItem>
                                    ))

                                    }
                                </SelectContent>
                            </Select>

                        )}

                    />}

                {(type === "remove" || type === "recolor") &&
                    <div className='prompt-field'>
                        <CustomField control={form.control}
                            name="prompt"
                            className='w-full'
                            formLabel={type === "remove" ? "Object to remove" : "Object to recolor"}
                            render={({ field }) =>
                                <Input value={field.value}
                                    className='input-field'
                                    onChange={(e) => onInputChangeHandler("prompt", e.target.value, type, field.onChange)}
                                />
                            }
                        />

                    </div>
                }
                {type === "recolor" &&
                    <div className='prompt-field'>
                        <CustomField control={form.control}
                            name="color"
                            className='w-full'
                            formLabel="Replacement Color"
                            render={({ field }) =>
                                <Input value={field.value}
                                    className='input-field'
                                    onChange={(e) => onInputChangeHandler("color", e.target.value, "recolor", field.onChange)}
                                />
                            }
                        />

                    </div>
                }
                <div className='media-uploader-field'>
                    <CustomField
                        className='flex size-full flex-col'
                        control={form.control}
                        name="publicId"
                        render={({ field }) => (
                            <MediaUploader
                                onValueChange={field.onChange}
                                setImage={setImage}
                                publicId={field.value}
                                image={image}
                                type={type}
                            />

                        )}
                    />

                    <TransformedImage
                        image={image}
                        type={type}
                        title={form.getValues().title}
                        isTransforming={isTransforming}
                        setIsTransforming={setIsTransforming}
                        transformationConfig={transformationConfig}
                    />
                </div>


                <div className='flex flex-col gap-4'>

                    {((action === "Update" && type === "fill") || (action === "Update" && type === "removeBackground")) ? "" : <Button type="button"
                        className='submit-button capitalize'
                        disabled={isTransforming || newTransformation === null}
                        onClick={onTransformHandler}
                    >
                        {isTransforming ? "Transforming..." : "Apply Transformation"}
                    </Button>}


                    <Button type="submit"
                        className='submit-button capitalize'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Save Image"}
                    </Button>

                </div>

            </form>
        </Form>
    )
}

export default TransformationForm