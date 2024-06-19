"use client";

import * as React from "react";
import { XIcon } from "@/components/icons/x";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@/hooks/use-form";
import { createDocumentSchema } from "@/schemas";
import { z } from "zod";
import { LoaderIcon } from "@/components/icons/loader";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/sooner";
import { createDocument } from "../actions";

type FormData = z.infer<typeof createDocumentSchema>;

export const DocumentCreator = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { values, formState, refs, setValue, handleSubmit, reset } =
    useForm<FormData>({
      schema: createDocumentSchema,
      defaultValues: { name: undefined, url: null, content: undefined },
    });

  const onSubmit = async (data: FormData) => {
    const result = await createDocument(data);

    if (result.success) {
      toast("Document created successfully", { type: "success" });
      setIsOpen(false);
    } else {
      toast(result.error.message, { type: "error" });
    }
  };

  const errors = formState.errors;
  const isDisabled = formState.isDisabled || formState.isSubmitting;
  const isSubmitting = formState.isSubmitting;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isDisabled) return;
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Create document</Button>
      </DialogTrigger>
      <DialogPanel size="large" onCloseAutoFocus={() => reset()}>
        <DialogHeader>
          <DialogTitle>Create document</DialogTitle>
          <DialogCloseButton asChild>
            <Button variant="ghost" size="icon" aria-label="Close">
              <XIcon />
            </Button>
          </DialogCloseButton>
        </DialogHeader>
        <DialogBody>
          <form
            id="create-document-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Name */}
            <Field>
              <FieldLabel className="required-indicator">Name</FieldLabel>
              <FieldControl>
                <Input
                  value={values.name ?? ""}
                  onValueChange={(value) => {
                    setValue("name", value || undefined);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("name")}
                />
              </FieldControl>
              <FieldError errors={errors.name} />
            </Field>

            {/* URL */}
            <Field>
              <FieldLabel>URL</FieldLabel>
              <FieldControl>
                <Input
                  value={values.url ?? ""}
                  onValueChange={(value) => {
                    setValue("url", value || null);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("url")}
                />
              </FieldControl>
              <FieldError errors={errors.url} />
            </Field>

            {/* Content */}
            <Field>
              <FieldLabel className="required-indicator">Content</FieldLabel>
              <FieldControl>
                <Textarea
                  value={values.content ?? ""}
                  onValueChange={(value) => {
                    setValue("content", value || undefined);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("content")}
                />
              </FieldControl>

              <FieldError errors={errors.content} />
            </Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogCloseButton asChild>
            <Button variant="ghost" disabled={isDisabled}>
              Cancel
            </Button>
          </DialogCloseButton>
          <Button
            type="submit"
            form="create-document-form"
            disabled={isDisabled}
          >
            {isSubmitting && <LoaderIcon className="animate-spin" />}
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  );
};
