"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { Message } from "@/components/message";
import { LoaderIcon } from "@/components/icons/loader";
import { ArrowRightIcon } from "@/components/icons/arrow-right";
import { Text } from "@/components/ui/text";
import { Patient } from "../data";
import { CogIcon } from "@/components/icons/cog";
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
import { z } from "zod";
import { DefaultValues, useForm } from "@/hooks/use-form";
import { toast } from "@/lib/sooner";
import { updatePatientSchema } from "@/schemas";
import { updatePatient } from "../actions";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPanel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ChatProps = { patient: Patient };

export const Chat = ({ patient }: ChatProps) => {
  const [AIisWritting, setAIIsWritting] = React.useState(false);

  const { messages, input, isLoading, handleInputChange, handleSubmit } =
    useChat({
      api: "/api/chat",
      body: { patient },
      onResponse: () => setAIIsWritting(true),
      onFinish: () => setAIIsWritting(false),
    });

  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-zinc-50">
      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl p-6">
          {messages.length > 0 ? (
            <>
              <div className="flex flex-col gap-y-4">
                {messages.map((message) => {
                  const { id, role, content, toolInvocations } = message;

                  if ((role === "user" || role === "assistant") && !!content) {
                    return (
                      <Message
                        key={id}
                        align={message.role === "user" ? "right" : "left"}
                        content={message.content}
                      />
                    );
                  }

                  if (role === "assistant" && toolInvocations) {
                    const invocation = toolInvocations[0];
                    return "result" in invocation ? (
                      <Message
                        key={id}
                        align="left"
                        content={`Consultation scheduled for ${invocation.result.date} at ${invocation.result.time}. ✅`}
                      />
                    ) : (
                      <Message
                        key={id}
                        align="left"
                        content={`Scheduling consultation...`}
                      />
                    );
                  }

                  return null;
                })}
                {isLoading && !AIisWritting && (
                  <LoaderIcon className="animate-spin text-zinc-600 dark:text-zinc-400" />
                )}
              </div>
            </>
          ) : (
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-y-1">
              <Text size="lg" weight="medium">
                Let&apos;s chat!
              </Text>
              <Text size="base">
                I can help you with personalized nutrition advice!
              </Text>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mx-auto w-full max-w-3xl px-6 pb-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="w-full rounded-full bg-white p-4 px-4 py-3 text-zinc-900 shadow outline-none ring-1 ring-zinc-950/10 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 right-2 flex items-center justify-center">
            <button
              tabIndex={-1}
              type="submit"
              disabled={isLoading || !input}
              className="rounded-full bg-zinc-900 p-2 hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-60"
            >
              <ArrowRightIcon className="text-white" />
            </button>
          </div>
        </form>
      </div>

      {/* Settings dialog */}
      <SettingsDialog patient={patient} />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               SETTINGS DIALOG                              */
/* -------------------------------------------------------------------------- */

type FormData = z.infer<typeof updatePatientSchema>;

type SettingsDialogProps = { patient: Patient };

const SettingsDialog = ({ patient }: SettingsDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultValues = React.useMemo<DefaultValues<FormData>>(() => {
    return {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      fitnessGoal: patient.fitnessGoal,
      likedFoods: patient.likedFoods.join(", "),
      dislikedFoods: patient.dislikedFoods.join(", "),
      foodAllergies: patient.foodAllergies.join(", "),
      healthConditions: patient.healthConditions.join(", "),
    };
  }, [patient]);

  const { values, formState, refs, setValue, setErrors, handleSubmit, reset } =
    useForm<FormData>({
      schema: updatePatientSchema,
      defaultValues,
    });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  React.useEffect(() => {
    if (!formState.errors.root) return;
    toast(formState.errors.root[0], { type: "error" });
  }, [formState.errors.root]);

  const onSubmit = async (data: FormData) => {
    const result = await updatePatient(data);

    if (result.success) {
      toast("Patient updated successfully", { type: "success" });
      setIsOpen(false);
    } else {
      setErrors(result.errors);
    }
  };

  const errors = formState.errors;
  const isDisabled = formState.isDisabled || formState.isSubmitting;
  const isSubmitting = formState.isSubmitting;
  const isDirty = formState.isDirty;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isDisabled) return;
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed right-4 top-4">
          <CogIcon />
        </Button>
      </DialogTrigger>
      <DialogPanel onCloseAutoFocus={() => reset()}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogCloseButton asChild>
            <Button variant="ghost" size="icon">
              <XIcon />
            </Button>
          </DialogCloseButton>
        </DialogHeader>
        <DialogBody>
          <form
            id="update-patient-form"
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

            {/* Age */}
            <Field>
              <FieldLabel className="required-indicator">Age</FieldLabel>
              <FieldControl>
                <Input
                  value={values.age ? values.age.toString() : ""}
                  onValueChange={(value) => {
                    setValue("age", value ? parseInt(value) : undefined);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("age")}
                />
              </FieldControl>
              <FieldError errors={errors.age} />
            </Field>

            {/* Gender */}
            <Field>
              <FieldLabel className="required-indicator">Gender</FieldLabel>
              <Select
                value={values.gender}
                onValueChange={(value) => {
                  setValue("gender", value as "male" | "female");
                }}
                disabled={isDisabled}
              >
                <FieldControl>
                  <SelectTrigger ref={refs.set("gender")}>
                    <SelectValue />
                  </SelectTrigger>
                </FieldControl>
                <SelectPanel>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectPanel>
              </Select>
              <FieldError errors={errors.gender} />
            </Field>

            {/* Fitness goal */}
            <Field>
              <FieldLabel>Fitness goal</FieldLabel>
              <FieldControl>
                <Input
                  value={values.fitnessGoal ?? ""}
                  onValueChange={(value) => {
                    setValue("fitnessGoal", value || null);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("fitnessGoal")}
                />
              </FieldControl>
              <FieldError errors={errors.fitnessGoal} />
            </Field>

            {/* Liked foods */}
            <Field>
              <FieldLabel>Foods you like</FieldLabel>
              <FieldControl>
                <Input
                  value={values.likedFoods ?? ""}
                  onValueChange={(value) => {
                    setValue("likedFoods", value || null);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("likedFoods")}
                />
              </FieldControl>
              <FieldError errors={errors.likedFoods} />
            </Field>

            {/* Disliked foods */}
            <Field>
              <FieldLabel>Foods you dislike</FieldLabel>
              <FieldControl>
                <Input
                  value={values.dislikedFoods ?? ""}
                  onValueChange={(value) => {
                    setValue("dislikedFoods", value || null);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("dislikedFoods")}
                />
              </FieldControl>
              <FieldError errors={errors.dislikedFoods} />
            </Field>

            {/* Food allergies */}
            <Field>
              <FieldLabel>Foods you are allergic to</FieldLabel>
              <FieldControl>
                <Input
                  value={values.foodAllergies ?? ""}
                  onValueChange={(value) => {
                    setValue("foodAllergies", value || null);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("foodAllergies")}
                />
              </FieldControl>
              <FieldError errors={errors.foodAllergies} />
            </Field>

            {/* Health conditions */}
            <Field>
              <FieldLabel>Health conditions</FieldLabel>
              <FieldControl>
                <Input
                  value={values.healthConditions ?? ""}
                  onValueChange={(value) => {
                    setValue("healthConditions", value || null);
                  }}
                  disabled={isDisabled}
                  ref={refs.set("healthConditions")}
                />
              </FieldControl>
              <FieldError errors={errors.healthConditions} />
            </Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogCloseButton asChild>
            <Button variant="secondary" disabled={isDisabled}>
              Cancel
            </Button>
          </DialogCloseButton>
          <Button
            type="submit"
            form="update-patient-form"
            disabled={isDisabled || !isDirty}
          >
            {isSubmitting && <LoaderIcon className="animate-spin" />}
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogPanel>
    </Dialog>
  );
};
