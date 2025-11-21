"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  securityId: z.string().min(1, "Select a security"),
  amount: z.coerce.number().min(1000, "Minimum GHS 1,000"),
  account: z.string().min(1, "Select funding account"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  defaultSecurityId?: string;
};

export function SubscribeDialog({ open, onClose, defaultSecurityId }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { securityId: defaultSecurityId ?? "", amount: 1000, account: "main" },
  });

  React.useEffect(() => {
    if (open) {
      reset({ securityId: defaultSecurityId ?? "", amount: 1000, account: "main" });
    }
  }, [open, defaultSecurityId, reset]);

  const onSubmit = async (values: FormValues) => {
    // Stub: wire to API when ready
    await new Promise((r) => setTimeout(r, 600));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to Offering</DialogTitle>
          <DialogDescription>
            Place a subscription instruction for a government security.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="securityId">Security</Label>
            <Input id="securityId" placeholder="e.g. tb-91" {...register("securityId")} />
            {errors.securityId && <p className="text-xs text-red-600">{errors.securityId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (GHS)</Label>
            <Input id="amount" type="number" step={100} min={1000} {...register("amount", { valueAsNumber: true })} />
            {errors.amount && <p className="text-xs text-red-600">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Funding Account</Label>
            <Select defaultValue="main" onValueChange={(v) => (document.activeElement as HTMLElement)?.blur()}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Settlement</SelectItem>
                <SelectItem value="custody">Custody</SelectItem>
              </SelectContent>
            </Select>
            {errors.account && <p className="text-xs text-red-600">{errors.account.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
