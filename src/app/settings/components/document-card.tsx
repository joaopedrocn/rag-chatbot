"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Document } from "../data";
import { Text, TextLink } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { dismissToast, toast } from "@/lib/sooner";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from "@/components/ui/dialog";
import { XIcon } from "@/components/icons/x";
import { deleteDocument } from "../actions";

type DocumentCardProps = { document: Document };

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const [viewerIsOpen, setViewerIsOpen] = React.useState(false);

  const viewButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const onDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirm) return;

    const toastId = toast("Deleting...", { type: "loading" });

    const result = await deleteDocument(document.id);

    if (result.success) {
      toast("Document deleted successfully", { type: "success" });
    } else {
      toast(result.error.message, { type: "error" });
    }

    dismissToast(toastId);
  };

  return (
    <>
      <Card
        key={document.id}
        className="flex items-center justify-between gap-x-4 p-4"
      >
        <div>
          <Text weight="medium">{document.name}</Text>
          <Text className="mt-1">{document.sections.length} chunks</Text>
        </div>
        <div className="flex items-center gap-x-4">
          <Button
            variant="secondary"
            onClick={() => setViewerIsOpen(true)}
            ref={viewButtonRef}
          >
            View
          </Button>
          <Button variant="secondary" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </Card>

      {/* Viewer */}
      <Dialog open={viewerIsOpen} onOpenChange={setViewerIsOpen}>
        <DialogPanel
          size="large"
          onCloseAutoFocus={() => viewButtonRef.current?.focus()}
        >
          <DialogHeader>
            <DialogTitle>{document.name}</DialogTitle>
            <DialogCloseButton asChild>
              <Button variant="ghost" size="icon" aria-label="Close">
                <XIcon />
              </Button>
            </DialogCloseButton>
          </DialogHeader>
          <DialogBody>
            {document.url && (
              <div className="mb-4">
                <TextLink href={document.url}>{document.url}</TextLink>
              </div>
            )}
            <div className="[&_span:nth-child(5n+0)]:bg-red-100 [&_span:nth-child(5n-1)]:bg-orange-100 [&_span:nth-child(5n-2)]:bg-yellow-100 [&_span:nth-child(5n-3)]:bg-blue-100 [&_span:nth-child(5n-4)]:bg-green-100">
              {document.sections.map((section, i, arr) => (
                <span key={section.id}>
                  {`${section.content}${i !== arr.length - 1 ? " " : ""}`}
                </span>
              ))}
            </div>
          </DialogBody>
        </DialogPanel>
      </Dialog>
    </>
  );
};
